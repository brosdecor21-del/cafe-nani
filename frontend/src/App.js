import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { CartProvider } from "./context/CartContext";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import BeansPage from "./pages/BeansPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CartDrawer from "./components/cart/CartDrawer";
import CheckoutModal from "./components/cart/CheckoutModal";
import { Toaster } from "./components/ui/sonner";

// Grain texture overlay component
const GrainOverlay = () => (
  <div className="grain-overlay" aria-hidden="true" />
);

function App() {
  // Initialize smooth scroll with Lenis
  useEffect(() => {
    const initLenis = async () => {
      try {
        const Lenis = (await import('@studio-freight/lenis')).default;
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Add class for smooth scrolling
        document.documentElement.classList.add('lenis');

        return () => {
          lenis.destroy();
        };
      } catch (error) {
        console.log('Lenis not loaded:', error);
      }
    };

    initLenis();
  }, []);

  return (
    <LanguageProvider>
      <CartProvider>
        <div className="App" data-testid="app-root">
          <GrainOverlay />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/beans" element={<BeansPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
            
            {/* Global Cart Components */}
            <CartDrawer />
            <CheckoutModal />
          </BrowserRouter>
          
          {/* Toast notifications */}
          <Toaster position="top-right" richColors />
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
