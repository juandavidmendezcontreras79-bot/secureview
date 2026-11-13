import React, { useState, useEffect } from 'react';
import { Database, PackageCheck, RefreshCw, CheckCircle, AlertCircle, Calendar, DollarSign, User, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface OrdersHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrdersHistoryModal({ isOpen, onClose }: OrdersHistoryModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [customNeonUrl, setCustomNeonUrl] = useState('');
  const [isConfiguringDb, setIsConfiguringDb] = useState(false);
  const [configMessage, setConfigMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchOrdersAndStatus = async () => {
    setLoading(true);
    try {
      const [ordersRes, statusRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/db-status')
      ]);

      const ordersData = await ordersRes.json();
      const statusData = await statusRes.json();

      if (ordersData.orders) {
        setOrders(ordersData.orders);
      }
      setDbStatus(statusData);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrdersAndStatus();
    }
  }, [isOpen]);

  const handleSaveNeonUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNeonUrl.trim()) return;

    setIsConfiguringDb(true);
    setConfigMessage(null);

    try {
      const res = await fetch('/api/config-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databaseUrl: customNeonUrl.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al conectar con la base de datos Neon');
      }

      setConfigMessage({ type: 'success', text: data.message });
      setCustomNeonUrl('');
      fetchOrdersAndStatus();
    } catch (err: any) {
      setConfigMessage({ type: 'error', text: err.message });
    } finally {
      setIsConfiguringDb(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in" id="orders-history-modal">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 overflow-hidden text-brand-blue-900 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-blue-50 text-brand-blue-600 rounded-xl">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-black text-brand-blue-900">
                Historial de Compras en Base de Datos
              </h3>
              <p className="font-sans text-xs text-gray-500">
                Registro persistente de compras almacenadas en Neon PostgreSQL
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrdersAndStatus}
              className="p-2 text-gray-400 hover:text-brand-blue-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              title="Refrescar"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-brand-blue-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Database Status Bar */}
        <div className="my-4 p-3.5 bg-gray-50 border border-gray-200/80 rounded-xl flex-shrink-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-bold text-brand-blue-900">
                Estado Base de Datos: {dbStatus?.connected ? 'Conectado a Neon PostgreSQL Cloud' : 'Persistencia Local Activa (Esperando URL de Neon)'}
              </span>
            </div>
            <span className="font-mono text-gray-500 text-[11px]">
              {orders.length} {orders.length === 1 ? 'compra registrada' : 'compras registradas'}
            </span>
          </div>

          {/* Quick Neon Connection URL form */}
          <details className="text-xs text-gray-600">
            <summary className="cursor-pointer font-semibold text-brand-blue-600 hover:underline inline-flex items-center gap-1">
              <span>{dbStatus?.connected ? 'Configuración de Neon Database (Activa)' : 'Conectar Base de Datos Neon (Pegar URL de Conexión)'}</span>
            </summary>
            <form onSubmit={handleSaveNeonUrl} className="mt-2.5 pt-2.5 border-t border-gray-200 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="postgresql://usuario:contraseña@ep-xyz.neon.tech/neondb?sslmode=require"
                value={customNeonUrl}
                onChange={(e) => setCustomNeonUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono focus:border-brand-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isConfiguringDb || !customNeonUrl.trim()}
                className="px-4 py-2 bg-brand-blue-900 hover:bg-brand-blue-950 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer disabled:bg-gray-400"
              >
                {isConfiguringDb ? 'Verificando...' : 'Guardar y Conectar Neon'}
              </button>
            </form>
            {configMessage && (
              <p className={`mt-2 text-xs font-medium ${configMessage.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                {configMessage.text}
              </p>
            )}
          </details>
        </div>

        {/* Orders list scroll area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {orders.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center space-y-2 text-gray-500">
              <PackageCheck className="h-10 w-10 text-gray-300" />
              <p className="text-sm font-semibold">Aún no hay compras registradas en la base de datos.</p>
              <p className="text-xs text-gray-400">
                Agrega productos al carrito y haz clic en "Comprar Producto" para probar la persistencia.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl border border-gray-200/90 hover:border-brand-blue-300 bg-white hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-brand-blue-50 text-brand-blue-700 px-2 py-0.5 rounded border border-brand-blue-100">
                      {order.id}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="h-3 w-3" />
                      Completada
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 font-medium">Cliente:</span>{' '}
                    <strong className="text-gray-800">{order.customerName}</strong>
                    <div className="text-gray-500 text-[11px]">{order.customerEmail} • {order.customerPhone}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Despacho:</span>{' '}
                    <span className="text-gray-700">{order.shippingAddress}</span>
                  </div>
                </div>

                {/* Items Purchased */}
                <div className="bg-gray-50/60 p-2.5 rounded-lg space-y-1 text-xs">
                  <div className="font-semibold text-gray-600 text-[11px] uppercase tracking-wider mb-1">
                    Productos Comprados:
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-mono font-bold">USD {item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200/80 pt-1.5 flex justify-between font-bold text-brand-blue-900">
                    <span>Total Pagado:</span>
                    <span className="font-mono text-brand-blue-600 text-sm">USD {order.total}</span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-brand-blue-900 hover:bg-brand-blue-950 text-white font-sans text-xs font-bold transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
