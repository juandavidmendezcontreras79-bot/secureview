import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InteractiveShowcase from './components/InteractiveShowcase';
import Products from './components/Products';
import SystemCustomizer from './components/SystemCustomizer';
import Benefits from './components/Benefits';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrdersHistoryModal from './components/OrdersHistoryModal';
import { Product, CartItem, Order } from './types';
import { Check } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customSetup, setCustomSetup] = useState<{
    propertyType: string;
    camerasCount: number;
    estimatedCost: number;
    suggestedProducts: string[];
  } | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Scroll smoothly to section
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`¡${product.name} se agregó al carrito!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Open direct purchase checkout
  const handleBuyProductFromCart = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Open Quote triggers
  const handleOpenGeneralQuote = () => {
    setSelectedProduct(null);
    setCustomSetup(null);
    setIsQuoteModalOpen(true);
  };

  const handleOpenProductQuote = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
    setCustomSetup(null);
    setIsQuoteModalOpen(true);
  };

  const handleOpenCustomSetupQuote = (setup: {
    propertyType: string;
    camerasCount: number;
    estimatedCost: number;
    suggestedProducts: string[];
  }) => {
    setSelectedProduct(null);
    setCustomSetup(setup);
    setIsQuoteModalOpen(true);
  };

  const handleQuoteInstallFromCart = () => {
    const productsList = cart.map(item => `${item.quantity}x ${item.product.name}`);
    const costEstimate = cart.reduce((tot, item) => tot + (item.product.price * item.quantity), 0);

    setSelectedProduct(null);
    setCustomSetup({
      propertyType: 'Cesta del Carrito',
      camerasCount: cart.reduce((tot, item) => tot + item.quantity, 0),
      estimatedCost: costEstimate,
      suggestedProducts: productsList
    });
    
    setIsCartOpen(false);
    setIsQuoteModalOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setCart([]);
    showToast(`¡Compra #${order.id} registrada exitosamente en la base de datos!`);
  };

  return (
    <div className="min-h-screen bg-brand-blue-950 font-sans selection:bg-brand-blue-500 selection:text-white" id="main-layout">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-brand-blue-900 border border-emerald-500/50 p-4 shadow-2xl flex items-center gap-3 text-white animate-slide-up" id="toast-notification">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Check className="h-5 w-5" />
          </div>
          <span className="font-sans text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header / Navbar */}
      <Navbar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuoteModal={handleOpenGeneralQuote}
        onOpenOrdersHistory={() => setIsHistoryOpen(true)}
        scrollToSection={scrollToSection}
      />

      {/* Main Sections */}
      <main>
        {/* Banner principal */}
        <Hero
          onOpenQuoteModal={handleOpenGeneralQuote}
          scrollToSection={scrollToSection}
        />

        {/* Demo interactiva de calidad */}
        <InteractiveShowcase />

        {/* Catálogo de cámaras destacadas */}
        <Products
          onAddToCart={handleAddToCart}
          onOpenQuoteModal={handleOpenProductQuote}
        />

        {/* Configurador / Calculador de Presupuestos */}
        <SystemCustomizer
          onOpenQuoteModal={handleOpenCustomSetupQuote}
        />

        {/* Sección de beneficios */}
        <Benefits />
      </main>

      {/* Pie de página */}
      <Footer
        scrollToSection={scrollToSection}
        onOpenQuoteModal={handleOpenGeneralQuote}
      />

      {/* Quotation Popup Modal */}
      <ContactForm
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        preSelectedProduct={selectedProduct}
        customSetup={customSetup}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onBuyProduct={handleBuyProductFromCart}
        onQuoteInstall={handleQuoteInstallFromCart}
        onOpenOrdersHistory={() => {
          setIsCartOpen(false);
          setIsHistoryOpen(true);
        }}
      />

      {/* Checkout Modal for buying products and persisting to database */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Orders History & Neon Database Inspector Modal */}
      <OrdersHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
