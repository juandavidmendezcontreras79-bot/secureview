import React from 'react';
import { ShieldCheck, Eye, Activity, Smartphone, ChevronRight } from 'lucide-react';
import { HERO_IMAGE } from '../data';

interface HeroProps {
  onOpenQuoteModal: () => void;
  scrollToSection: (id: string) => void;
}

export default function Hero({ onOpenQuoteModal, scrollToSection }: HeroProps) {
  const highlights = [
    { icon: <ShieldCheck className="h-5 w-5 text-brand-blue-500" />, text: 'Tecnología 4K' },
    { icon: <Eye className="h-5 w-5 text-brand-blue-500" />, text: 'Visión Nocturna' },
    { icon: <Activity className="h-5 w-5 text-brand-blue-500" />, text: 'Detección IA' },
    { icon: <Smartphone className="h-5 w-5 text-brand-blue-500" />, text: 'Acceso Remoto' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-brand-blue-950 flex items-center" id="inicio">
      {/* Background Image with advanced overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Cámara de seguridad de alta tecnología"
          className="h-full w-full object-cover object-center opacity-40 scale-105 animate-fade-in"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-950 via-brand-blue-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-950 via-transparent to-brand-blue-950/50" />
      </div>

      {/* Decorative pulse glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            {/* Promo Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue-500/30 bg-brand-blue-500/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-blue-500 animate-pulse" />
              <span className="font-mono text-xs font-semibold tracking-wider text-brand-blue-100 uppercase">
                Tecnología de Seguridad 2026
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Protege lo que más importa con cámaras de seguridad de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue-100 via-brand-blue-500 to-white">
                alta definición
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
              Monitoreo profesional de máxima claridad para tu hogar o negocio. 
              Sistemas inteligentes con resolución **4K Ultra HD**, **visión nocturna avanzada**, 
              **detección de movimiento mediante inteligencia artificial** y transmisión remota directa a tus dispositivos móviles.
            </p>

            {/* Features list in grid */}
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-brand-blue-500/30 transition-all group"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue-900/50 group-hover:bg-brand-blue-500/20 transition-all">
                    {item.icon}
                  </div>
                  <span className="font-sans text-sm font-semibold text-gray-200">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => scrollToSection('productos')}
                className="flex items-center justify-center gap-2 rounded-full bg-brand-blue-500 px-8 py-4 font-sans font-bold text-white hover:bg-brand-blue-600 shadow-lg hover:shadow-[0_0_25px_rgba(30,96,145,0.5)] transition-all cursor-pointer group"
                id="hero-buy-now-btn"
              >
                <span>Comprar ahora</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onOpenQuoteModal}
                className="flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/20 px-8 py-4 font-sans font-bold text-white hover:bg-white/20 transition-all cursor-pointer"
                id="hero-quote-btn"
              >
                Solicitar Cotización Gratis
              </button>
            </div>
          </div>

          {/* Quick interactive visual widget on the right */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-brand-blue-950/80 p-6 backdrop-blur-md shadow-2xl relative">
              {/* Camera Live Feed Simulation UI */}
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">SECUREVIEW_CAM_01</span>
                </div>
                <span className="font-mono text-xs text-brand-blue-100 bg-brand-blue-900/60 px-2 py-0.5 rounded border border-brand-blue-500/30">
                  4K LIVE
                </span>
              </div>

              {/* simulated lens graphic */}
              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black group">
                <img
                  src={HERO_IMAGE}
                  alt="Vista previa de cámara"
                  className="h-full w-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                
                {/* scanning grid overlay */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />
                
                {/* target indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-16 h-16 border-2 border-brand-blue-500/40 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="text-[10px] font-mono text-white/80 bg-black/60 px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-brand-blue-500" /> Visión Nocturna Inteligente
                  </span>
                </div>
              </div>

              {/* quick features specs summary */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-white/5 border border-white/5 p-3 rounded-lg text-center">
                  <span className="block font-mono text-xs text-brand-blue-100 font-bold">Res.</span>
                  <span className="block font-display text-sm font-extrabold text-white">4K UHD</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-lg text-center">
                  <span className="block font-mono text-xs text-brand-blue-100 font-bold">Lente</span>
                  <span className="block font-display text-sm font-extrabold text-white">110°</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-lg text-center">
                  <span className="block font-mono text-xs text-brand-blue-100 font-bold">FPS</span>
                  <span className="block font-display text-sm font-extrabold text-white">30 fps</span>
                </div>
              </div>

              {/* trigger simulation slider button */}
              <button
                onClick={() => scrollToSection('demostracion')}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-brand-blue-900/40 hover:bg-brand-blue-900/80 border border-brand-blue-500/30 py-3 font-sans text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <span>Probar simulador interactivo</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
