import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONFIG_FILE = path.join(DATA_DIR, 'neon-config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Get Neon database URL from env or local config file
function getDatabaseUrl(): string | null {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    return process.env.DATABASE_URL.trim();
  }
  if (process.env.NEON_DATABASE_URL && process.env.NEON_DATABASE_URL.trim() !== '') {
    return process.env.NEON_DATABASE_URL.trim();
  }
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      if (config.databaseUrl && typeof config.databaseUrl === 'string') {
        return config.databaseUrl.trim();
      }
    } catch {
      // Ignore config read error
    }
  }
  return null;
}

// Initialize Neon table if URL is available
async function ensureNeonTable(dbUrl: string): Promise<boolean> {
  try {
    const sql = neon(dbUrl);
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(100) NOT NULL,
        shipping_address TEXT NOT NULL,
        items JSONB NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        total NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'completado',
        payment_method VARCHAR(50) DEFAULT 'transferencia_segura',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('[Neon] Orders table verified / created successfully.');
    return true;
  } catch (error) {
    console.error('[Neon] Failed to ensure orders table:', error);
    return false;
  }
}

// Local storage helper
function readLocalOrders(): any[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    const content = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch {
    return [];
  }
}

function writeLocalOrders(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing local orders:', e);
  }
}

app.use(express.json());

// API: Database status & diagnostics
app.get('/api/db-status', async (_req: Request, res: Response) => {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    const localOrders = readLocalOrders();
    return res.json({
      connected: false,
      driver: 'local_storage',
      target: 'Neon PostgreSQL (Esperando URL de conexión)',
      ordersCount: localOrders.length,
      message: 'Base de datos Neon pendiente de conexión. Almacenando temporalmente en persistencia local activa.'
    });
  }

  try {
    const sql = neon(dbUrl);
    const result = await sql`SELECT NOW() as current_time, current_database() as db_name, version() as pg_version;`;
    const countResult = await sql`SELECT COUNT(*)::int as count FROM orders;`;
    
    return res.json({
      connected: true,
      driver: 'neon_serverless',
      target: 'Neon PostgreSQL Cloud',
      dbName: result[0]?.db_name || 'neondb',
      serverTime: result[0]?.current_time,
      pgVersion: result[0]?.pg_version,
      ordersCount: countResult[0]?.count || 0,
      message: 'Conectado exitosamente a la base de datos Neon.'
    });
  } catch (err: any) {
    const localOrders = readLocalOrders();
    return res.json({
      connected: false,
      driver: 'local_storage_fallback',
      target: 'Neon PostgreSQL (Error al conectar)',
      error: err.message,
      ordersCount: localOrders.length,
      message: 'No se pudo conectar a Neon con la URL proporcionada. Usando respaldo local persistente.'
    });
  }
});

// API: Configure or test Neon connection string dynamically
app.post('/api/config-db', async (req: Request, res: Response) => {
  const { databaseUrl } = req.body;
  if (!databaseUrl || typeof databaseUrl !== 'string') {
    return res.status(400).json({ error: 'Se requiere una URL de conexión válida.' });
  }

  try {
    const sql = neon(databaseUrl.trim());
    await sql`SELECT 1;`;
    await ensureNeonTable(databaseUrl.trim());

    // Save to neon-config.json
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({
      databaseUrl: databaseUrl.trim(),
      updatedAt: new Date().toISOString()
    }, null, 2));

    process.env.DATABASE_URL = databaseUrl.trim();

    return res.json({
      success: true,
      message: '¡Conexión a Neon PostgreSQL verificada y guardada con éxito!'
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: `Error al conectar con Neon: ${error.message}`
    });
  }
});

// API: Get all purchases / orders
app.get('/api/orders', async (_req: Request, res: Response) => {
  const dbUrl = getDatabaseUrl();
  if (dbUrl) {
    try {
      const sql = neon(dbUrl);
      await ensureNeonTable(dbUrl);
      const rows = await sql`
        SELECT 
          id,
          customer_name as "customerName",
          customer_email as "customerEmail",
          customer_phone as "customerPhone",
          shipping_address as "shippingAddress",
          items,
          subtotal::float,
          total::float,
          status,
          payment_method as "paymentMethod",
          notes,
          created_at as "createdAt"
        FROM orders 
        ORDER BY created_at DESC;
      `;
      return res.json({
        success: true,
        source: 'neon_postgres',
        orders: rows
      });
    } catch (err) {
      console.error('Error fetching orders from Neon, falling back to local:', err);
    }
  }

  // Fallback to local storage
  const localOrders = readLocalOrders();
  return res.json({
    success: true,
    source: 'local_storage',
    orders: localOrders
  });
});

// API: Place a new purchase order
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      total,
      paymentMethod = 'transferencia_segura',
      notes = ''
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para registrar la compra.' });
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const createdAt = new Date().toISOString();

    const newOrder = {
      id: orderId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress: (shippingAddress || 'A coordinar con el cliente').trim(),
      items,
      subtotal: Number(subtotal) || 0,
      total: Number(total) || 0,
      status: 'completado',
      paymentMethod,
      notes: notes.trim(),
      createdAt
    };

    let savedInNeon = false;
    const dbUrl = getDatabaseUrl();

    if (dbUrl) {
      try {
        const sql = neon(dbUrl);
        await ensureNeonTable(dbUrl);
        await sql`
          INSERT INTO orders (
            id,
            customer_name,
            customer_email,
            customer_phone,
            shipping_address,
            items,
            subtotal,
            total,
            status,
            payment_method,
            notes,
            created_at
          ) VALUES (
            ${newOrder.id},
            ${newOrder.customerName},
            ${newOrder.customerEmail},
            ${newOrder.customerPhone},
            ${newOrder.shippingAddress},
            ${JSON.stringify(newOrder.items)},
            ${newOrder.subtotal},
            ${newOrder.total},
            ${newOrder.status},
            ${newOrder.paymentMethod},
            ${newOrder.notes},
            ${newOrder.createdAt}
          );
        `;
        savedInNeon = true;
        console.log(`[Neon] Order ${orderId} saved into Neon PostgreSQL.`);
      } catch (neonErr) {
        console.error('[Neon] Could not save into Neon, persisting locally:', neonErr);
      }
    }

    // Always keep in local storage as well for backup / offline safety
    const local = readLocalOrders();
    local.unshift({ ...newOrder, sourceDb: savedInNeon ? 'neon' : 'local_persistent' });
    writeLocalOrders(local);

    return res.status(201).json({
      success: true,
      message: savedInNeon 
        ? '¡Compra procesada y guardada con éxito en la base de datos Neon!' 
        : '¡Compra procesada y registrada en el sistema de órdenes!',
      database: savedInNeon ? 'Neon PostgreSQL' : 'Persistencia Local',
      order: {
        ...newOrder,
        sourceDb: savedInNeon ? 'neon' : 'local_persistent'
      }
    });

  } catch (error: any) {
    console.error('Error placing order:', error);
    return res.status(500).json({ error: error.message || 'Error interno al registrar la orden' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Attempt to initialize Neon table in background if URL present
  const dbUrl = getDatabaseUrl();
  if (dbUrl) {
    ensureNeonTable(dbUrl).catch(console.error);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
