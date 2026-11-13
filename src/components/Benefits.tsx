import React from 'react';
import { Wrench, ShieldAlert, FileCheck, Headphones, ShieldCheck, Heart } from 'lucide-react';
import { BENEFITS } from '../data';

export default function Benefits() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="h-6 w-6 text-brand-blue-500" />;
      case 'ShieldAlert':
        return <ShieldAlert className="h-6 w-6 text-brand-blue-500" />;
      case 'FileCheck':
        return <FileCheck className="h-6 w-6 text-brand-blue-500" />;
      case 'Headphones':
        return <Headphones className="h-6 w-6 text-brand-blue-500" />;
      default:
        return <ShieldCheck className="h-6 w-6 text-brand-blue-500" />;
    }
  };

  return (
    <section className="py-24 bg-white text-brand-blue-900" id="beneficios">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue-100 border border-brand-blue-200 px-3 py-1 text-xs font-mono font-bold tracking-wider text-brand-blue-900 uppercase mb-3">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-blue-500" /> Máxima Confianza
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-blue-900 leading-tight">
              ¿Por qué elegir SecureView para tu seguridad?
            </h2>
          </div>
          <div>
            <p className="font-sans text-gray-600 text-sm sm:text-base leading-relaxed">
              No vendemos simplemente cámaras; entregamos soluciones de protección llave en mano respaldadas por ingeniería de redes avanzada, soporte telefónico y un firme compromiso de servicio técnico de por vida.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.id}
              className="group p-6 rounded-2xl bg-brand-blue-50 border border-brand-blue-100 hover:border-brand-blue-500/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              id={`benefit-card-${benefit.id}`}
            >
              {/* Icon Container */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white group-hover:bg-brand-blue-900/10 transition-all shadow-sm border border-brand-blue-100 mb-6">
                {getIcon(benefit.iconName)}
              </div>

              {/* Title & Description */}
              <h3 className="font-display text-lg font-extrabold text-brand-blue-900 mb-2">
                {benefit.title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Extra decorative trust seal or banner */}
        <div className="mt-16 bg-brand-blue-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          {/* subtle camera grid visual background */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-brand-blue-950/90 pointer-events-none" />
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 bg-brand-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="font-mono text-xs text-brand-blue-500 font-bold tracking-widest uppercase">Seguridad Homologada</span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">¿Necesitas asesoramiento profesional personalizado?</h3>
              <p className="font-sans text-sm text-gray-300 max-w-2xl">
                Nuestros ingenieros de seguridad realizan levantamientos de planos técnicos sin costo. Te ayudamos a decidir la ubicación perfecta de las cámaras para eliminar cualquier punto ciego.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <a
                href="https://wa.me/18005550199"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-blue-500 hover:bg-brand-blue-600 px-8 py-4 font-sans font-bold text-white shadow-lg transition-all cursor-pointer text-sm"
              >
                <Headphones className="h-5 w-5" />
                <span>Hablar con un Ingeniero</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
