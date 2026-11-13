import React, { useState } from 'react';
import { ShoppingBag, CreditCard, CheckCircle2, ShieldCheck, Truck, Database, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export default function CheckoutModal({ isOpen, onClose, cart, onOrderSuccess }: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setErrorMessage('Por favor completa todos los campos requeridos (*).');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('El carrito está vacío. Agrega productos antes de comprar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        items: cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          resolution: item.product.resolution,
          image: item.product.image
        })),
        subtotal,
        total,
        paymentMethod: paymentMethod === 'transferencia' 
          ? 'Transferencia Bancaria Inmediata' 
          : paymentMethod === 'tarjeta' 
            ? 'Tarjeta Débito/Crédito' 
            : 'Contra Entrega / En Instalación',
        notes: notes.trim()
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al procesar tu compra.');
      }

      setCompletedOrder(data.order);
      onOrderSuccess(data.order);
    } catch (err: any) {
      console.error('Error submitting order:', err);
      setErrorMessage(err.message || 'Error al conectar con la base de datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in" id="checkout-modal">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 overflow-hidden text-brand-blue-900 max-h-[92vh] overflow-y-auto">
        
        {/* Header / Close */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-black text-brand-blue-900">
                {completedOrder ? '¡Compra Exitosa y Guardada!' : 'Finalizar y Comprar Producto'}
              </h3>
              <p className="font-sans text-xs text-gray-500">
                {completedOrder ? 'Tu pedido ha sido registrado en la base de datos' : 'Seguridad garantizada y registro en base de datos'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-brand-blue-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!completedOrder ? (
          <form onSubmit={handleSubmitOrder} className="mt-5 space-y-6">
            
            {/* Database indicator */}
            <div className="flex items-center justify-between p-3 bg-brand-blue-50 border border-brand-blue-100/80 rounded-xl text-xs font-sans">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-brand-blue-600" />
                <span className="font-semibold text-brand-blue-900">Persistencia de Compras:</span>
                <span className="text-gray-600">Almacenamiento seguro en Neon PostgreSQL</span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Activa
              </span>
            </div>

            {/* Order summary snippet */}
            <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 space-y-3">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-gray-500">
                Resumen de Equipos ({cart.reduce((c, i) => c + i.quantity, 0)} unidades)
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 font-medium truncate max-w-xs">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-mono font-bold text-brand-blue-900">
                      USD {item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200/80 pt-2.5 flex justify-between items-center text-sm">
                <span className="font-bold text-brand-blue-900">Total a Pagar:</span>
                <span className="font-display font-black text-brand-blue-600 text-lg font-mono">
                  USD {total}
                </span>
              </div>
            </div>

            {/* Customer Information Inputs */}
            <div className="space-y-4">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-gray-500">
                Datos del Comprador y Envío
              </h4>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Roberto Morales"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/40 text-sm focus:border-brand-blue-500 focus:bg-white focus:outline-none transition-all"
                  id="checkout-name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="roberto@empresa.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/40 text-sm focus:border-brand-blue-500 focus:bg-white focus:outline-none transition-all"
                    id="checkout-email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Teléfono Móvil *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+56 9 8765 4321"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/40 text-sm focus:border-brand-blue-500 focus:bg-white focus:outline-none transition-all"
                    id="checkout-phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Dirección de Despacho o Instalación *</label>
                <input
                  type="text"
                  required
                  placeholder="Av. Providencia 1234, Oficina 502, Santiago"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/40 text-sm focus:border-brand-blue-500 focus:bg-white focus:outline-none transition-all"
                  id="checkout-address"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Método de Pago</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transferencia')}
                    className={`p-3 rounded-xl border text-left text-xs font-sans transition-all cursor-pointer flex flex-col gap-1 ${
                      paymentMethod === 'transferencia'
                        ? 'border-brand-blue-500 bg-brand-blue-50/50 text-brand-blue-900 font-bold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-bold">
                      <CreditCard className="h-3.5 w-3.5 text-brand-blue-500" />
                      Transferencia
                    </span>
                    <span className="text-[10px] text-gray-500 font-normal">Sin comisiones extras</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`p-3 rounded-xl border text-left text-xs font-sans transition-all cursor-pointer flex flex-col gap-1 ${
                      paymentMethod === 'tarjeta'
                        ? 'border-brand-blue-500 bg-brand-blue-50/50 text-brand-blue-900 font-bold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="h-3.5 w-3.5 text-brand-blue-500" />
                      Tarjeta
                    </span>
                    <span className="text-[10px] text-gray-500 font-normal">Webpay / Débito / Crédito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('contraentrega')}
                    className={`p-3 rounded-xl border text-left text-xs font-sans transition-all cursor-pointer flex flex-col gap-1 ${
                      paymentMethod === 'contraentrega'
                        ? 'border-brand-blue-500 bg-brand-blue-50/50 text-brand-blue-900 font-bold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-bold">
                      <Truck className="h-3.5 w-3.5 text-brand-blue-500" />
                      Contra Entrega
                    </span>
                    <span className="text-[10px] text-gray-500 font-normal">Pagas al recibir o instalar</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Notas o Instrucciones para el Técnico</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Timbre 502, disponibilidad de instalación los días viernes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/40 text-sm focus:border-brand-blue-500 focus:bg-white focus:outline-none transition-all"
                  id="checkout-notes"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Volver al Carrito
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-sm px-6 py-3.5 shadow-lg transition-all cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                id="confirm-checkout-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Guardando compra en la Base de Datos...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirmar y Comprar Producto (USD {total})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Order confirmation success screen */
          <div className="py-6 space-y-6 text-center animate-slide-up" id="order-success-screen">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display text-2xl font-black text-brand-blue-900">
                ¡Tu Compra ha sido Confirmada!
              </h3>
              <p className="font-sans text-xs text-gray-600 max-w-md mx-auto">
                Tu pedido se ha registrado y guardado exitosamente en la base de datos para su preparación y despacho.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 max-w-md mx-auto text-left space-y-3 text-xs font-sans">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2.5">
                <span className="text-gray-500 font-semibold">Número de Orden:</span>
                <span className="font-mono font-black text-brand-blue-900 text-sm bg-white px-2 py-0.5 rounded border border-gray-200">
                  {completedOrder.id}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Base de Datos:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Database className="h-3.5 w-3.5" />
                  {completedOrder.sourceDb === 'neon' ? 'Neon PostgreSQL Cloud' : 'Persistencia Local Segura'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Cliente:</span>
                <span className="font-bold text-gray-800">{completedOrder.customerName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Dirección:</span>
                <span className="text-gray-700 truncate max-w-[200px]">{completedOrder.shippingAddress}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Método de Pago:</span>
                <span className="text-gray-700">{completedOrder.paymentMethod}</span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-2.5">
                <span className="font-bold text-brand-blue-900">Monto Total:</span>
                <span className="font-mono text-base font-black text-brand-blue-600">
                  USD {completedOrder.total}
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-gray-400">
              Se ha enviado un correo de comprobante a <strong>{completedOrder.customerEmail}</strong>.
            </p>

            <button
              onClick={handleClose}
              className="rounded-xl bg-brand-blue-900 hover:bg-brand-blue-950 px-8 py-3.5 font-sans text-xs font-bold text-white transition-all cursor-pointer shadow-md"
              id="close-success-btn"
            >
              Cerrar y Continuar en la Tienda
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
