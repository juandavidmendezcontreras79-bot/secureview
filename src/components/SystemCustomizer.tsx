import React, { useState } from 'react';
import { Sliders, Home, Building2, Warehouse, Shield, Check, FileSpreadsheet, Sparkles, HelpCircle } from 'lucide-react';
import { PRODUCTS } from '../data';
import { Product } from '../types';

interface SystemCustomizerProps {
  onOpenQuoteModal: (customSetup: {
    propertyType: string;
    camerasCount: number;
    estimatedCost: number;
    suggestedProducts: string[];
  }) => void;
}

export default function SystemCustomizer({ onOpenQuoteModal }: SystemCustomizerProps) {
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial' | 'industrial'>('residential');
  const [camerasCount, setCamerasCount] = useState<number>(4);
  const [needsNightVision, setNeedsNightVision] = useState(true);
  const [needsAudio, setNeedsAudio] = useState(false);
  const [needsPTZ, setNeedsPTZ] = useState(false);
  const [needsNVR, setNeedsNVR] = useState(true);

  // Calculate dynamic recommendations
  const getRecommendationAndCost = () => {
    let suggested: string[] = [];
    let baseCost = 0;

    // Standard products
    const camIP = PRODUCTS.find(p => p.id === 'cam-ip-4k');
    const camPTZ = PRODUCTS.find(p => p.id === 'cam-ptz-360');
    const camExt = PRODUCTS.find(p => p.id === 'cam-ext-2k');
    const kit4k = PRODUCTS.find(p => p.id === 'kit-security-4k');

    // NVR discount or kit replacement
    if (camerasCount >= 4 && needsNVR && propertyType === 'residential') {
      // Recommending standard kit is cheaper
      suggested.push('Kit de Seguridad 4 Cámaras 4K (NVR Incluido)');
      baseCost += 799;
      
      const extraCams = camerasCount - 4;
      if (extraCams > 0) {
        if (needsPTZ) {
          suggested.push(`${extraCams}x Cámaras PTZ 360° Adicionales`);
          baseCost += extraCams * (camPTZ?.price || 349);
        } else {
          suggested.push(`${extraCams}x Cámaras IP 4K Adicionales`);
          baseCost += extraCams * (camIP?.price || 199);
        }
      }
    } else {
      // Piece by piece calculation
      let ptzCount = needsPTZ ? Math.ceil(camerasCount * 0.25) : 0;
      let bulletCount = camerasCount - ptzCount;

      if (ptzCount > 0) {
        suggested.push(`${ptzCount}x Cámaras PTZ Profesionales 360°`);
        baseCost += ptzCount * (camPTZ?.price || 349);
      }
      
      if (bulletCount > 0) {
        if (propertyType === 'residential' && !needsNightVision) {
          suggested.push(`${bulletCount}x Cámaras Exterior 2K WiFi`);
          baseCost += bulletCount * (camExt?.price || 149);
        } else {
          suggested.push(`${bulletCount}x Cámaras IP 4K Ultra HD`);
          baseCost += bulletCount * (camIP?.price || 199);
        }
      }

      if (needsNVR) {
        suggested.push('Grabador NVR Profesional con Disco Duro de 2TB');
        baseCost += 249; // cost of custom NVR unit
      }
    }

    // Add installation fee estimate based on size
    let installationFee = camerasCount * 45; // USD 45 per camera installation
    if (propertyType === 'commercial') installationFee += 150;
    if (propertyType === 'industrial') installationFee += 350;

    const totalEstimate = baseCost + installationFee;

    return {
      suggested,
      hardwareCost: baseCost,
      installationFee,
      totalEstimate
    };
  };

  const results = getRecommendationAndCost();

  const propertyDetails = {
    residential: {
      label: 'Residencial',
      desc: 'Casas, departamentos o condominios residenciales.',
      icon: <Home className="h-5 w-5 text-brand-blue-500" />
    },
    commercial: {
      label: 'Comercial',
      desc: 'Oficinas, locales minoristas, tiendas o restaurantes.',
      icon: <Building2 className="h-5 w-5 text-brand-blue-500" />
    },
    industrial: {
      label: 'Industrial',
      desc: 'Fábricas, almacenes, bodegas o centros logísticos.',
      icon: <Warehouse className="h-5 w-5 text-brand-blue-500" />
    }
  };

  const handleOpenQuote = () => {
    onOpenQuoteModal({
      propertyType: propertyDetails[propertyType].label,
      camerasCount,
      estimatedCost: results.totalEstimate,
      suggestedProducts: results.suggested
    });
  };

  return (
    <section className="py-24 bg-brand-blue-900 text-white relative overflow-hidden" id="configurador">
      {/* Background visual graphics */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue-500/10 border border-brand-blue-500/20 px-3.5 py-1 text-xs font-mono font-bold tracking-wider text-brand-blue-100 uppercase">
            <Sparkles className="h-3.5 w-3.5 text-brand-blue-500" /> Planificador Inteligente
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Diseña tu Sistema de Seguridad Personalizado
          </h2>
          <p className="font-sans text-gray-400 text-base">
            Responde estas breves preguntas y nuestra herramienta calculará instantáneamente el mix de cámaras óptimo, el costo de hardware y un estimativo de instalación profesional.
          </p>
        </div>

        {/* Customizer Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Question Wizard Side */}
          <div className="lg:col-span-7 bg-brand-blue-950/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-8">
            
            {/* Q1: Property type */}
            <div className="space-y-4">
              <label className="block font-display text-sm font-bold uppercase tracking-wider text-brand-blue-100">
                1. Tipo de propiedad a proteger
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(Object.keys(propertyDetails) as Array<keyof typeof propertyDetails>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setPropertyType(key)}
                    className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all cursor-pointer ${
                      propertyType === key
                        ? 'border-brand-blue-500 bg-brand-blue-500/10 shadow-lg'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="p-3 bg-brand-blue-900/50 rounded-lg mb-3">
                      {propertyDetails[key].icon}
                    </div>
                    <span className="font-display text-sm font-bold text-white block">{propertyDetails[key].label}</span>
                    <span className="font-sans text-[10px] text-gray-400 mt-1 leading-normal">
                      {propertyDetails[key].desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Q2: Camera Count */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block font-display text-sm font-bold uppercase tracking-wider text-brand-blue-100">
                  2. Número de cámaras requeridas
                </label>
                <span className="font-mono text-lg font-extrabold bg-brand-blue-500 px-3 py-1 rounded text-white shadow-md">
                  {camerasCount} {camerasCount === 1 ? 'Cámara' : 'Cámaras'}
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={camerasCount}
                  onChange={(e) => setCamerasCount(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-blue-500 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>1 Cámara (Básico)</span>
                  <span>4 Cámaras (Estándar)</span>
                  <span>8 Cámaras (Completo)</span>
                  <span>16+ Cámaras (Grado Comercial)</span>
                </div>
              </div>
            </div>

            {/* Q3: Features checkboxes */}
            <div className="space-y-4">
              <label className="block font-display text-sm font-bold uppercase tracking-wider text-brand-blue-100">
                3. Requerimientos especiales
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Night vision toggle */}
                <label className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={needsNightVision}
                    onChange={(e) => setNeedsNightVision(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded bg-white/10 border-white/20 text-brand-blue-500 focus:ring-0"
                  />
                  <div>
                    <span className="block font-sans text-sm font-semibold text-white">Visión nocturna premium</span>
                    <span className="block text-[11px] text-gray-400">LEDs integrados para mantener el color completo incluso de noche.</span>
                  </div>
                </label>

                {/* Audio toggle */}
                <label className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={needsAudio}
                    onChange={(e) => setNeedsAudio(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded bg-white/10 border-white/20 text-brand-blue-500 focus:ring-0"
                  />
                  <div>
                    <span className="block font-sans text-sm font-semibold text-white">Audio bidireccional</span>
                    <span className="block text-[11px] text-gray-400">Posibilidad de escuchar y hablar de vuelta mediante la cámara.</span>
                  </div>
                </label>

                {/* PTZ toggle */}
                <label className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={needsPTZ}
                    onChange={(e) => setNeedsPTZ(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded bg-white/10 border-white/20 text-brand-blue-500 focus:ring-0"
                  />
                  <div>
                    <span className="block font-sans text-sm font-semibold text-white">Rotación de cámara (PTZ)</span>
                    <span className="block text-[11px] text-gray-400">Rotación completa de 360° para vigilar grandes extensiones de terreno.</span>
                  </div>
                </label>

                {/* NVR Recording unit */}
                <label className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={needsNVR}
                    onChange={(e) => setNeedsNVR(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded bg-white/10 border-white/20 text-brand-blue-500 focus:ring-0"
                  />
                  <div>
                    <span className="block font-sans text-sm font-semibold text-white">Respaldo continuo (NVR)</span>
                    <span className="block text-[11px] text-gray-400">Grabador centralizado para resguardar hasta 30 días de video continuo sin internet.</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Dynamic Budget Display Side */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-brand-blue-950 to-brand-blue-950/80 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-brand-blue-100 uppercase">Resumen del Sistema Recomenado</span>
                <h3 className="font-display text-xl font-bold mt-1">Configuración Optimizada</h3>
              </div>

              {/* Suggested Product Mix */}
              <div className="space-y-3">
                <span className="block font-mono text-[10px] text-gray-400 uppercase tracking-wider">Equipos Recomendados:</span>
                <ul className="space-y-2">
                  {results.suggested.map((prod, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs font-sans text-gray-300">
                      <Check className="h-4 w-4 text-brand-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{prod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Budget breakup */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex justify-between font-sans text-xs text-gray-400">
                  <span>Hardware y Cámaras:</span>
                  <span className="font-mono text-white">USD {results.hardwareCost}</span>
                </div>
                <div className="flex justify-between font-sans text-xs text-gray-400">
                  <span>Instalación y Cableado (Est.):</span>
                  <span className="font-mono text-white">USD {results.installationFee}</span>
                </div>
                <div className="flex justify-between font-sans text-xs text-gray-400">
                  <span>Soporte Técnico de Configuración:</span>
                  <span className="font-mono text-emerald-400 font-bold uppercase">Gratis</span>
                </div>
                <div className="flex justify-between font-sans text-xs text-gray-400">
                  <span>Garantía de Hardware Extendida:</span>
                  <span className="font-mono text-emerald-400 font-bold uppercase">Incluida (2 Años)</span>
                </div>
              </div>

              {/* Total display */}
              <div className="pt-4 border-t border-white/10 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-baseline">
                  <span className="font-sans text-xs font-semibold text-brand-blue-100">Presupuesto Estimado:</span>
                  <div className="text-right">
                    <span className="block font-display text-2xl sm:text-3xl font-black text-white">USD {results.totalEstimate}</span>
                    <span className="text-[10px] font-mono text-gray-400 block -mt-1">*Instalación básica incluida</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Form Trigger CTA */}
            <div className="pt-6">
              <button
                onClick={handleOpenQuote}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 px-6 py-4 font-sans font-bold text-white shadow-lg transition-all cursor-pointer"
                id="customizer-submit-quote"
              >
                <FileSpreadsheet className="h-5 w-5" />
                Solicitar Cotización de este Diseño
              </button>
              <p className="mt-3 text-center font-mono text-[9px] text-gray-500">
                Al enviar, un ingeniero revisará tu diseño e iniciará la pre-configuración de tu kit sin costo adicional.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
