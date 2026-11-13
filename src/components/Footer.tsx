import React from 'react';
import { Shield, Mail, Phone, MapPin, Youtube, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  scrollToSection: (id: string) => void;
  onOpenQuoteModal: () => void;
}

export default function Footer({ scrollToSection, onOpenQuoteModal }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (id: string) => {
    scrollToSection(id);
  };

  return (
    <footer className="bg-brand-blue-950 text-white border-t border-white/10" id="contacto">
      {/* Upper Footer content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Logo & About */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleLinkClick('inicio')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue-500 text-white">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                SECURE<span className="text-brand-blue-500">VIEW</span>
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed max-w-md">
              Líderes en tecnología de videovigilancia ultra alta definición para entornos residenciales, comerciales e industriales en todo el país. Protegemos tu patrimonio con la mayor nitidez técnica posible.
            </p>
            {/* Social handles */}
            <div className="flex items-center gap-4">
              <a href="#facebook" className="p-2 bg-white/5 hover:bg-brand-blue-500 hover:text-white rounded-lg transition-colors text-gray-400" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#instagram" className="p-2 bg-white/5 hover:bg-brand-blue-500 hover:text-white rounded-lg transition-colors text-gray-400" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#twitter" className="p-2 bg-white/5 hover:bg-brand-blue-500 hover:text-white rounded-lg transition-colors text-gray-400" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#linkedin" className="p-2 bg-white/5 hover:bg-brand-blue-500 hover:text-white rounded-lg transition-colors text-gray-400" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#youtube" className="p-2 bg-white/5 hover:bg-brand-blue-500 hover:text-white rounded-lg transition-colors text-gray-400" aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2.5 space-y-4">
            <h4 className="font-display text-sm font-bold tracking-wider uppercase text-brand-blue-100">Enlaces Rápidos</h4>
            <ul className="space-y-2.5 font-sans text-sm">
              <li>
                <button onClick={() => handleLinkClick('inicio')} className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left">Inicio</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('demostracion')} className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left">Demostración 4K</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('productos')} className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left">Catálogo Cámaras</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('configurador')} className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left">Diseña tu Sistema</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('beneficios')} className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left">Ventajas SecureView</button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3.5 space-y-4">
            <h4 className="font-display text-sm font-bold tracking-wider uppercase text-brand-blue-100">Información de Contacto</h4>
            <ul className="space-y-3 font-sans text-xs sm:text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-brand-blue-500 flex-shrink-0" />
                <span>Av. de las Tecnologías 410, Parque Industrial Tecnológico, Santiago, Chile</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-5 w-5 text-brand-blue-500 flex-shrink-0" />
                <a href="tel:+18005550199" className="hover:text-white transition-colors">+1 (800) 555-0199</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-5 w-5 text-brand-blue-500 flex-shrink-0" />
                <a href="mailto:soporte@secureviewpro.com" className="hover:text-white transition-colors">ventas@secureviewpro.com</a>
              </li>
            </ul>
          </div>

          {/* Quick quote signup */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-display text-sm font-bold tracking-wider uppercase text-brand-blue-100 font-extrabold text-white">¿Todo listo?</h4>
            <p className="font-sans text-xs text-gray-400">
              Cotiza sin compromiso en minutos y obtén tarifas especiales de instalación.
            </p>
            <button
              onClick={onOpenQuoteModal}
              className="w-full text-center rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 px-4 py-3 font-sans font-bold text-white transition-all text-xs cursor-pointer shadow-md"
            >
              Iniciar Cotización
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="bg-brand-blue-950/80 border-t border-white/5 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] sm:text-xs text-gray-500">
          <div>
            &copy; {currentYear} SecureView Pro S.A. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <a href="#privacidad" className="hover:text-gray-300 transition-colors">Política de Privacidad</a>
            <span>•</span>
            <a href="#terminos" className="hover:text-gray-300 transition-colors">Términos del Servicio</a>
            <span>•</span>
            <a href="#garantia" className="hover:text-gray-300 transition-colors">Detalles de Garantía</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
