import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, Building, MessageSquare, Shield, Check, ClipboardCheck, Settings, Loader2, AlertTriangle } from 'lucide-react';
import { QuoteRequest, Product } from '../types';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedProduct?: Product | null;
  customSetup?: {
    propertyType: string;
    camerasCount: number;
    estimatedCost: number;
    suggestedProducts: string[];
  } | null;
}

export default function ContactForm({ isOpen, onClose, preSelectedProduct, customSetup }: ContactFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial' | 'industrial'>('residential');
  const [camerasNeeded, setCamerasNeeded] = useState(4);
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Prepopulate if details exist
  useEffect(() => {
    if (preSelectedProduct) {
      setMessage(`Me gustaría recibir una cotización formal para el producto: ${preSelectedProduct.name} (Precio ref: USD ${preSelectedProduct.price}). Incluyendo instalación.`);
      setCamerasNeeded(1);
    } else if (customSetup) {
      const typeMap: Record<string, 'residential' | 'commercial' | 'industrial'> = {
        'Residencial': 'residential',
        'Comercial': 'commercial',
        'Industrial': 'industrial'
      };
      setPropertyType(typeMap[customSetup.propertyType] || 'residential');
      setCamerasNeeded(customSetup.camerasCount);
      setMessage(`Diseño de sistema personalizado enviado:
- Tipo: ${customSetup.propertyType}
- Cantidad de cámaras: ${customSetup.camerasCount}
- Equipos propuestos: ${customSetup.suggestedProducts.join(', ')}
- Costo estimado: USD ${customSetup.estimatedCost}`);
    } else {
      setMessage('');
      setCamerasNeeded(4);
      setPropertyType('residential');
    }
  }, [preSelectedProduct, customSetup, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setValidationError('Por favor complete todos los campos obligatorios (*).');
      return;
    }

    setIsSubmitting(true);

    // Simulate server request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTicketId(`SEC-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1800);
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPropertyType('residential');
    setCamerasNeeded(4);
    setMessage('');
    setValidationError(null);
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in" id="quote-modal-overlay">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 overflow-hidden text-brand-blue-900 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-brand-blue-900 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
          id="close-quote-modal"
        >
          ✕
        </button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-5 pt-3" id="quote-form">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-brand-blue-500 uppercase font-bold">Sin costo adicional</span>
              <h3 className="font-display text-2xl font-extrabold text-brand-blue-900">Solicitar Cotización Especial</h3>
              <p className="font-sans text-xs text-gray-500">
                Completa tus datos y un ingeniero experto te contactará en menos de 2 horas hábiles.
              </p>
            </div>

            {/* Context Notice Tag */}
            {preSelectedProduct && (
              <div className="p-3 bg-brand-blue-50 border border-brand-blue-100 rounded-lg text-xs font-sans text-brand-blue-900">
                Seleccionado: <strong className="text-brand-blue-600">{preSelectedProduct.name}</strong> (USD {preSelectedProduct.price})
              </div>
            )}
            {customSetup && (
              <div className="p-3.5 bg-brand-blue-50 border border-brand-blue-100 rounded-lg text-xs font-sans text-brand-blue-900 space-y-1">
                <div>Sistema Personalizado cargado:</div>
                <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                  <li>Tipo de propiedad: <strong>{customSetup.propertyType}</strong></li>
                  <li>Cámaras: <strong>{customSetup.camerasCount} unidades</strong></li>
                  <li>Presupuesto estimado: <strong>USD {customSetup.estimatedCost}</strong></li>
                </ul>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Nombre Completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:border-brand-blue-500 focus:bg-white focus:outline-none focus:ring-0 transition-all text-brand-blue-900"
                    id="quote-fullName"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Correo Electrónico *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="juan@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:border-brand-blue-500 focus:bg-white focus:outline-none focus:ring-0 transition-all text-brand-blue-900"
                      id="quote-email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Teléfono Móvil *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="Ej. +56 9 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:border-brand-blue-500 focus:bg-white focus:outline-none focus:ring-0 transition-all text-brand-blue-900"
                      id="quote-phone"
                    />
                  </div>
                </div>
              </div>

              {/* Property & Cameras (Only if not customized setup) */}
              {!customSetup && !preSelectedProduct && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Tipo de Inmueble</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value as any)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:border-brand-blue-500 focus:bg-white focus:outline-none focus:ring-0 transition-all text-brand-blue-900 appearance-none"
                      >
                        <option value="residential">Residencial / Hogar</option>
                        <option value="commercial">Comercial / Oficina</option>
                        <option value="industrial">Industrial / Bodega</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Cámaras requeridas</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={camerasNeeded}
                      onChange={(e) => setCamerasNeeded(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:border-brand-blue-500 focus:bg-white focus:outline-none focus:ring-0 transition-all text-brand-blue-900 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Specific message or details */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Detalles Adicionales / Requerimientos</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <textarea
                    rows={3}
                    placeholder="Ej. Requiero que graben con lluvia fuerte y tener acceso desde 3 teléfonos móviles diferentes..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:border-brand-blue-500 focus:bg-white focus:outline-none focus:ring-0 transition-all text-brand-blue-900"
                    id="quote-message"
                  />
                </div>
              </div>
            </div>

            {validationError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2.5 text-xs font-sans text-red-600 animate-pulse">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-500" />
                <span>{validationError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 px-6 py-4 font-sans font-bold text-white shadow-lg transition-all cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              id="quote-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Procesando requerimiento...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Agendar Cotización Gratis</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* --- SUCCESS STATE VIEW --- */
          <div className="text-center py-8 space-y-6 animate-slide-up" id="quote-success-view">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <ClipboardCheck className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-black text-brand-blue-900">¡Solicitud Recibida con Éxito!</h3>
              <p className="font-sans text-sm text-gray-500 px-4">
                Muchas gracias, <strong className="text-brand-blue-900">{fullName}</strong>. Tu requerimiento técnico de videovigilancia ha sido ingresado en nuestro sistema.
              </p>
            </div>

            {/* Ticket details summary card */}
            <div className="p-5 rounded-xl border border-emerald-100 bg-emerald-50/50 max-w-sm mx-auto text-left space-y-2 text-xs font-sans">
              <div className="flex justify-between border-b border-emerald-100/50 pb-2">
                <span className="font-semibold text-emerald-800">Código de Ticket:</span>
                <span className="font-mono font-bold text-brand-blue-900">{ticketId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estado:</span>
                <span className="font-semibold text-emerald-700">Asignado a Ingeniero Principal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tiempo de espera estimado:</span>
                <span className="font-semibold text-brand-blue-900">45 minutos hábiles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Contacto asignado:</span>
                <span className="font-semibold text-gray-700">{phone}</span>
              </div>
            </div>

            <p className="font-sans text-xs text-gray-400">
              Hemos enviado un correo de confirmación de agenda a <strong>{email}</strong> con el folleto técnico completo de instalación.
            </p>

            <button
              onClick={handleReset}
              className="rounded-xl bg-brand-blue-900 hover:bg-brand-blue-950 px-8 py-3 font-sans text-xs font-bold text-white transition-all cursor-pointer"
              id="quote-success-close"
            >
              Cerrar y Volver al Sitio
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
