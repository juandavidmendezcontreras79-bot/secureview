import React, { useState } from 'react';
import { Shield, ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenQuoteModal: () => void;
  onOpenOrdersHistory: () => void;
  scrollToSection: (id: string) => void;
}

export default function Navbar({ cart, onOpenCart, onOpenQuoteModal, onOpenOrdersHistory, scrollToSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Inicio', id: 'inicio' },
    { name: 'Demostración 4K', id: 'demostracion' },
    { name: 'Productos', id: 'productos' },
    { name: 'Diseña tu Sistema', id: 'configurador' },
    { name: 'Beneficios', id: 'beneficios' },
  ];

  const handleLinkClick = (id: string) => {
    scrollToSection(id);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-brand-blue-950/90 backdrop-blur-md border-b border-white/10" id="navbar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleLinkClick('inicio')}>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-blue-500 text-white shadow-[0_0_15px_rgba(30,96,145,0.5)]">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                SECURE<span className="text-brand-blue-500">VIEW</span>
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-brand-blue-100 uppercase -mt-1">
                High-Resolution Security
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="font-sans text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Phone */}
            <a
              href="tel:+18005550199"
              className="flex items-center gap-2 font-mono text-xs text-brand-blue-100 hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4 text-brand-blue-500" />
              <span>+1 (800) 555-0199</span>
            </a>

            {/* Orders History Button */}
            <button
              onClick={onOpenOrdersHistory}
              className="text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
              id="nav-history-btn"
              title="Ver compras registradas en la base de datos"
            >
              <span>Mis Compras</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/5 cursor-pointer"
              aria-label="Ver carrito"
              id="cart-button"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue-500 font-sans text-[10px] font-bold text-white shadow-md">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Quote CTA Button */}
            <button
              onClick={onOpenQuoteModal}
              className="rounded-full bg-brand-blue-500 px-5 py-2.5 font-sans text-sm font-semibold text-white transition-all hover:bg-brand-blue-600 hover:shadow-[0_0_20px_rgba(30,96,145,0.4)] cursor-pointer"
              id="nav-quote-btn"
            >
              Solicitar Cotización
            </button>
          </div>

          {/* Mobile menu button & Mobile Cart */}
          <div className="flex md:hidden items-center gap-3">
            {/* Cart icon for mobile */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-full cursor-pointer"
              aria-label="Ver carrito"
            >
              <ShoppingCart className="h-5.5 w-5.5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-blue-500 font-sans text-[9px] font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Toggle menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg cursor-pointer"
              aria-label="Menu principal"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-brand-blue-950 px-4 pt-2 pb-6 space-y-3" id="mobile-menu">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-3 px-3">
              <Phone className="h-5 w-5 text-brand-blue-500" />
              <span className="font-mono text-sm text-gray-300">+1 (800) 555-0199</span>
            </div>
            <button
              onClick={() => {
                onOpenQuoteModal();
                setIsOpen(false);
              }}
              className="block w-full rounded-lg bg-brand-blue-500 py-3 text-center font-sans font-semibold text-white hover:bg-brand-blue-600 transition-all cursor-pointer"
              id="mobile-nav-quote-btn"
            >
              Solicitar Cotización Gratis
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
