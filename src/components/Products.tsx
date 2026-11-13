import React, { useState } from 'react';
import { Moon, Eye, Mic, Wifi, HardDrive, ShieldCheck, ShoppingCart, Info, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data';

interface ProductsProps {
  onAddToCart: (product: Product) => void;
  onOpenQuoteModal: (product?: Product) => void;
}

export default function Products({ onAddToCart, onOpenQuoteModal }: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  const categories = [
    { name: 'Todos los Equipos', id: 'todos' },
    { name: 'Cámaras de Exterior', id: 'exterior' },
    { name: 'Cámaras PTZ (360°)', id: 'ptz' },
    { name: 'Kits Completos', id: 'kit' },
  ];

  const filteredProducts = selectedCategory === 'todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

  // Return matching icon for product quick specs
  const renderSpecIcon = (featureName: string) => {
    const fnLower = featureName.toLowerCase();
    if (fnLower.includes('nocturna') || fnLower.includes('color') || fnLower.includes('infrar')) {
      return <Moon className="h-4 w-4 text-brand-blue-500" />;
    }
    if (fnLower.includes('movimiento') || fnLower.includes('detección') || fnLower.includes('silueta') || fnLower.includes('personas') || fnLower.includes('ia')) {
      return <Eye className="h-4 w-4 text-brand-blue-500" />;
    }
    if (fnLower.includes('audio') || fnLower.includes('parlante') || fnLower.includes('micrófono') || fnLower.includes('bidireccional')) {
      return <Mic className="h-4 w-4 text-brand-blue-500" />;
    }
    if (fnLower.includes('wifi') || fnLower.includes('conectividad') || fnLower.includes('móvil') || fnLower.includes('remoto')) {
      return <Wifi className="h-4 w-4 text-brand-blue-500" />;
    }
    if (fnLower.includes('grabador') || fnLower.includes('nvr') || fnLower.includes('almacenamiento') || fnLower.includes('disco')) {
      return <HardDrive className="h-4 w-4 text-brand-blue-500" />;
    }
    return <ShieldCheck className="h-4 w-4 text-brand-blue-500" />;
  };

  return (
    <section className="py-24 bg-grid-blue text-white relative overflow-hidden" id="productos">
      {/* Subtle blue ambient light radial-gradient overlay to make the grid look beautiful */}
      <div className="absolute inset-0 bg-radial-gradient from-brand-blue-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue-950/80 border border-brand-blue-500/30 px-3 py-1 text-xs font-mono font-bold tracking-wider text-brand-blue-400 uppercase mb-3 shadow-lg">
              <Sparkles className="h-3.5 w-3.5 text-brand-blue-400 animate-pulse" /> Catálogo Premium
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Cámaras de Seguridad Destacadas
            </h2>
            <p className="font-sans text-brand-blue-100 text-base max-w-xl mt-2 leading-relaxed">
              Selecciona hardware de grado industrial diseñado para resistir la intemperie y ofrecer una claridad sin precedentes bajo cualquier condición.
            </p>
          </div>

          {/* Categories Tab Selector */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-sans text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-brand-blue-500 text-white shadow-lg shadow-brand-blue-500/20 border border-brand-blue-400/30'
                    : 'bg-brand-blue-950/60 text-brand-blue-200 hover:bg-brand-blue-900/80 hover:text-white border border-brand-blue-800/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col h-full rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-blue-500/20 transition-all duration-300 overflow-hidden relative text-brand-blue-900"
              id={`product-card-${product.id}`}
            >
              {/* Product Image Panel */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual tags based on specifications */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="rounded-md bg-brand-blue-900/90 backdrop-blur-xs px-2.5 py-1 font-mono text-[9px] font-bold text-white uppercase tracking-wider">
                    {product.id === 'cam-ip-4k' || product.id === 'kit-security-4k' ? '4K UHD' : 'HD PRO'}
                  </span>
                  {product.id === 'cam-ext-2k' && (
                    <span className="rounded-md bg-emerald-700/90 backdrop-blur-xs px-2.5 py-1 font-mono text-[9px] font-bold text-white uppercase tracking-wider">
                      Resistente IP66
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="rounded-full bg-brand-blue-500 px-3.5 py-1.5 font-display text-sm font-black text-white shadow-md">
                    USD {product.price}
                  </span>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="font-display text-base font-extrabold text-brand-blue-900 group-hover:text-brand-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-mono text-[11px] text-brand-blue-500 font-semibold bg-brand-blue-50 px-2 py-0.5 rounded inline-block">
                    Resolución: {product.resolution}
                  </p>
                  
                  {/* Features quick checklist */}
                  <ul className="space-y-1 pt-1">
                    {product.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600 font-sans">
                        {renderSpecIcon(feat)}
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Cómo Funciona */}
                  <div className="mt-2.5 pt-2.5 border-t border-gray-100/80 bg-brand-blue-50/50 p-2.5 rounded-xl border border-brand-blue-100/30">
                    <p className="text-[10px] font-bold text-brand-blue-600 flex items-center gap-1 mb-1 font-mono uppercase tracking-wider">
                      <Sparkles className="h-3 w-3 text-brand-blue-500 animate-pulse" /> ¿Cómo funciona?
                    </p>
                    <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
                      {product.howItWorks}
                    </p>
                  </div>
                </div>

                {/* Card CTA Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue-900 hover:bg-brand-blue-950 text-white py-2 font-sans text-xs font-bold transition-all cursor-pointer"
                      id={`buy-${product.id}`}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Comprar
                    </button>
                    <button
                      onClick={() => setSelectedProductDetails(product)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-2 font-sans text-xs font-bold transition-all cursor-pointer"
                      id={`details-${product.id}`}
                    >
                      <Info className="h-3.5 w-3.5" />
                      Ficha Técnica
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onOpenQuoteModal(product)}
                    className="w-full text-center rounded-xl bg-brand-blue-50 hover:bg-brand-blue-100 text-brand-blue-600 border border-brand-blue-100 py-1.5 font-sans text-xs font-bold transition-all cursor-pointer"
                    id={`quote-${product.id}`}
                  >
                    Solicitar Cotización Especial
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Detail Modal */}
        {selectedProductDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in" id="product-detail-modal">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 overflow-hidden text-brand-blue-900 max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-brand-blue-900 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                id="close-detail-modal"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-4">
                {/* Image Section */}
                <div className="sm:col-span-5 space-y-4">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                      src={selectedProductDetails.image}
                      alt={selectedProductDetails.name}
                      className="h-full w-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-center p-3 bg-brand-blue-50 border border-brand-blue-100 rounded-lg">
                    <span className="block font-mono text-[10px] text-brand-blue-500 uppercase tracking-widest">Precio Especial</span>
                    <span className="font-display text-2xl font-black text-brand-blue-900">USD {selectedProductDetails.price}</span>
                  </div>
                </div>

                {/* Specs Section */}
                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-brand-blue-500 uppercase font-bold">Ficha de Especificaciones</span>
                    <h3 className="font-display text-2xl font-extrabold text-brand-blue-900">{selectedProductDetails.name}</h3>
                    <p className="font-sans text-xs text-gray-500 mt-1">{selectedProductDetails.resolution}</p>
                  </div>

                  {/* Cómo funciona destacado en Modal */}
                  <div className="bg-brand-blue-50 border border-brand-blue-100/70 p-4 rounded-xl">
                    <h4 className="font-sans text-xs font-bold text-brand-blue-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-brand-blue-500 animate-pulse" /> ¿Cómo funciona este equipo?
                    </h4>
                    <p className="text-xs text-brand-blue-950 leading-relaxed font-sans">
                      {selectedProductDetails.howItWorks}
                    </p>
                  </div>

                  {/* Technical Specs List */}
                  <div className="space-y-3 bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                    <h4 className="font-sans text-xs font-bold text-brand-blue-900 uppercase tracking-wider border-b border-gray-200 pb-1.5">Detalles Técnicos</h4>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="grid grid-cols-3 border-b border-gray-100 pb-1">
                        <span className="font-semibold text-gray-500">Sensor:</span>
                        <span className="col-span-2 text-gray-800">{selectedProductDetails.specs.resolutionDetail}</span>
                      </div>
                      <div className="grid grid-cols-3 border-b border-gray-100 pb-1">
                        <span className="font-semibold text-gray-500">Nocturna:</span>
                        <span className="col-span-2 text-gray-800">{selectedProductDetails.specs.nightVision}</span>
                      </div>
                      <div className="grid grid-cols-3 border-b border-gray-100 pb-1">
                        <span className="font-semibold text-gray-500">Detección:</span>
                        <span className="col-span-2 text-gray-800">{selectedProductDetails.specs.aiDetection}</span>
                      </div>
                      {selectedProductDetails.specs.waterproof && (
                        <div className="grid grid-cols-3 border-b border-gray-100 pb-1">
                          <span className="font-semibold text-gray-500">Clima:</span>
                          <span className="col-span-2 text-gray-800">{selectedProductDetails.specs.waterproof}</span>
                        </div>
                      )}
                      {selectedProductDetails.specs.zoom && (
                        <div className="grid grid-cols-3 border-b border-gray-100 pb-1">
                          <span className="font-semibold text-gray-500">Zoom:</span>
                          <span className="col-span-2 text-gray-800">{selectedProductDetails.specs.zoom}</span>
                        </div>
                      )}
                      {selectedProductDetails.specs.audio && (
                        <div className="grid grid-cols-3 border-b border-gray-100 pb-1">
                          <span className="font-semibold text-gray-500">Audio:</span>
                          <span className="col-span-2 text-gray-800">{selectedProductDetails.specs.audio}</span>
                        </div>
                      )}
                      {selectedProductDetails.specs.storage && (
                        <div className="grid grid-cols-3 pb-0">
                          <span className="font-semibold text-gray-500">Almacén:</span>
                          <span className="col-span-2 text-gray-800">{selectedProductDetails.specs.storage}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Highlights checklist */}
                  <div>
                    <h4 className="font-sans text-xs font-bold text-brand-blue-900 uppercase tracking-wider mb-2">Ventajas Clave</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProductDetails.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                          <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modal CTAs */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        onAddToCart(selectedProductDetails);
                        setSelectedProductDetails(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-blue-900 hover:bg-brand-blue-950 text-white py-3.5 font-sans text-sm font-bold transition-all cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Añadir al Carrito
                    </button>
                    <button
                      onClick={() => {
                        onOpenQuoteModal(selectedProductDetails);
                        setSelectedProductDetails(null);
                      }}
                      className="flex-1 rounded-xl border border-brand-blue-500/30 text-brand-blue-600 hover:bg-brand-blue-50 py-3.5 font-sans text-sm font-bold transition-all cursor-pointer text-center"
                    >
                      Cotizar Sistema Completo
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
