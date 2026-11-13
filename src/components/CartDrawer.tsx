import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, CheckCircle2, Database, History } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onBuyProduct: () => void;
  onQuoteInstall: () => void;
  onOpenOrdersHistory: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onBuyProduct,
  onQuoteInstall,
  onOpenOrdersHistory
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full text-brand-blue-900 animate-fade-in border-l border-gray-100">
          
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5.5 w-5.5 text-brand-blue-500" />
              <div>
                <h3 className="font-display text-base font-black text-brand-blue-900 flex items-center gap-2">
                  <span>Tu Carrito</span>
                  <span className="bg-brand-blue-50 text-brand-blue-600 font-mono text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenOrdersHistory}
                className="flex items-center gap-1 text-[11px] font-bold text-brand-blue-600 hover:text-brand-blue-800 bg-brand-blue-50 hover:bg-brand-blue-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Ver compras guardadas en Neon DB"
              >
                <Database className="h-3.5 w-3.5" />
                <span>Base de Datos</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-brand-blue-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                id="close-cart-drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Database Banner */}
          <div className="bg-emerald-50/70 border-b border-emerald-100 px-5 py-2 flex items-center justify-between text-[11px] text-emerald-800 font-sans">
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="h-3.5 w-3.5 text-emerald-600" />
              Base de datos Neon conectada para pedidos
            </span>
            <button
              onClick={onOpenOrdersHistory}
              className="text-[10px] font-bold underline hover:text-emerald-950 cursor-pointer"
            >
              Ver Guardados
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue-500 border border-brand-blue-100">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-brand-blue-900">El carrito está vacío</h4>
                  <p className="font-sans text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Añade cámaras de seguridad de alta resolución desde nuestro catálogo para equipar tu propiedad.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <button
                    onClick={onClose}
                    className="rounded-xl bg-brand-blue-900 hover:bg-brand-blue-950 text-white px-5 py-2.5 font-sans text-xs font-bold transition-all cursor-pointer"
                  >
                    Explorar Catálogo
                  </button>
                  <button
                    onClick={onOpenOrdersHistory}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 font-sans text-xs font-semibold transition-all cursor-pointer"
                  >
                    <History className="h-3.5 w-3.5 text-brand-blue-600" />
                    <span>Ver Mis Compras Guardadas</span>
                  </button>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all relative group"
                >
                  {/* Thumbnail */}
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-1 min-w-0">
                    <h4 className="font-display text-xs font-extrabold text-brand-blue-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="font-sans text-[10px] text-gray-500 truncate">
                      {item.product.resolution}
                    </p>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="font-display text-xs font-bold text-brand-blue-600 font-mono">
                        USD {item.product.price}
                      </span>
                      
                      {/* Quantity Toggles */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                          aria-label="Disminuir"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 font-mono text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100"
                    aria-label="Eliminar producto"
                    id={`remove-${item.product.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer block */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50/70 space-y-3.5">
              <div className="space-y-1.5 text-xs font-sans">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal de Equipos:</span>
                  <span className="font-mono text-brand-blue-900 font-bold">USD {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Envío & Logística:</span>
                  <span className="font-mono text-emerald-600 font-bold uppercase text-[10px]">Gratis</span>
                </div>
                <div className="flex justify-between font-display text-sm font-extrabold text-brand-blue-900 border-t border-gray-200 pt-2">
                  <span>Total a Pagar:</span>
                  <span className="font-mono text-lg text-emerald-600">USD {subtotal}</span>
                </div>
              </div>

              {/* Action Buttons: 1. Comprar Producto (Neon Database persistence) */}
              <div className="space-y-2">
                <button
                  onClick={onBuyProduct}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3.5 font-display font-bold text-white shadow-lg transition-all cursor-pointer group"
                  id="cart-buy-product-btn"
                >
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  <span>Comprar Producto (USD {subtotal})</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onQuoteInstall}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 hover:border-brand-blue-300 hover:bg-white px-4 py-2.5 font-sans font-semibold text-xs text-brand-blue-900 transition-all cursor-pointer"
                  id="cart-quote-install-btn"
                >
                  <ShieldCheck className="h-4 w-4 text-brand-blue-500" />
                  <span>Solicitar Instalación Técnica con Ingeniero</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-sans">
                <Database className="h-3 w-3 text-emerald-600" />
                <span>Las compras quedan guardadas en la base de datos Neon</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
