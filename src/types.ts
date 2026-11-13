export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  resolution: string;
  category: 'interior' | 'exterior' | 'ptz' | 'kit';
  features: string[];
  howItWorks: string;
  specs: {
    resolutionDetail: string;
    nightVision: string;
    aiDetection: string;
    storage?: string;
    waterproof?: string;
    zoom?: string;
    audio?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface QuoteRequest {
  fullName: string;
  email: string;
  phone: string;
  propertyType: 'residential' | 'commercial' | 'industrial';
  message: string;
  camerasNeeded: number;
  interestedProducts: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  resolution?: string;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: 'completado' | 'procesando' | 'en_camino';
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  sourceDb?: 'neon' | 'local_persistent';
}

