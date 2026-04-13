import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';

const CartItem = ({ item, language, onUpdateQuantity, onRemove }) => {
  const price = item.finalPrice || item.price;
  const sizeLabels = {
    small: { hu: 'Kicsi', en: 'Small' },
    medium: { hu: 'Kozepes', en: 'Medium' },
    large: { hu: 'Nagy', en: 'Large' },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="flex gap-4 py-4 border-b border-[#E5E0D8] last:border-0"
    >
      {/* Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.image_url}
          alt={language === 'hu' ? item.name_hu : item.name_en}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[#3A2F2A] truncate">
          {language === 'hu' ? item.name_hu : item.name_en}
        </h4>
        {item.size && (
          <p className="text-xs text-[#3A2F2A]/60 mt-0.5">
            {language === 'hu' ? sizeLabels[item.size]?.hu : sizeLabels[item.size]?.en}
          </p>
        )}
        {item.type === 'bean' && item.weight && (
          <p className="text-xs text-[#3A2F2A]/60 mt-0.5">
            {item.weight}g
          </p>
        )}
        <p className="text-[#C8A97E] font-medium mt-1">{price} Ft</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.size, item.quantity - 1, item.type)}
            className="w-7 h-7 flex items-center justify-center bg-[#F8F5F0] rounded-md hover:bg-[#E5E0D8] transition-colors"
          >
            <Minus size={14} />
          </button>
          <motion.span
            key={item.quantity}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-sm font-medium w-6 text-center"
          >
            {item.quantity}
          </motion.span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.size, item.quantity + 1, item.type)}
            className="w-7 h-7 flex items-center justify-center bg-[#F8F5F0] rounded-md hover:bg-[#E5E0D8] transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id, item.size, item.type)}
        className="p-2 text-[#3A2F2A]/40 hover:text-red-500 transition-colors self-start"
        aria-label="Remove item"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
};

const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    getSubtotal,
    openCheckout 
  } = useCart();
  const { language } = useLanguage();

  const subtotal = getSubtotal();

  // Translations
  const t = {
    cart: language === 'hu' ? 'Kosár' : 'Cart',
    empty: language === 'hu' ? 'A kosarad üres' : 'Your cart is empty',
    emptyDesc: language === 'hu' ? 'Adj hozzá termékeket a menüből' : 'Add items from the menu',
    subtotal: language === 'hu' ? 'Részösszeg' : 'Subtotal',
    checkout: language === 'hu' ? 'Pénztár' : 'Checkout',
    continueShopping: language === 'hu' ? 'Vásárlás folytatása' : 'Continue Shopping',
    items: language === 'hu' ? 'tétel' : 'items',
  };

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeCart]);

  // Prevent body scroll
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#1A1614]/50 backdrop-blur-sm z-50"
            data-testid="cart-backdrop"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            data-testid="cart-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E5E0D8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C8A97E] rounded-lg flex items-center justify-center">
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="font-['Cormorant_Garamond'] text-xl text-[#3A2F2A]">
                    {t.cart}
                  </h2>
                  <p className="text-xs text-[#3A2F2A]/60">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} {t.items}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-[#F8F5F0] rounded-lg transition-colors"
                data-testid="close-cart-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <div className="w-20 h-20 bg-[#F8F5F0] rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-[#C8A97E]" />
                  </div>
                  <p className="text-[#3A2F2A] font-medium">{t.empty}</p>
                  <p className="text-sm text-[#3A2F2A]/60 mt-1">{t.emptyDesc}</p>
                  <Button
                    onClick={closeCart}
                    className="mt-6 bg-[#C8A97E] hover:bg-[#B8996E] text-white"
                  >
                    {t.continueShopping}
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <CartItem
                      key={`${item.id}-${item.size}`}
                      item={item}
                      language={language}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border-t border-[#E5E0D8] bg-[#F8F5F0]"
              >
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#3A2F2A]/70">{t.subtotal}</span>
                  <motion.span
                    key={subtotal}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-xl font-medium text-[#3A2F2A]"
                  >
                    {subtotal.toLocaleString()} Ft
                  </motion.span>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={openCheckout}
                    className="w-full bg-[#3A2F2A] hover:bg-[#2A1F1A] text-white py-4 text-sm font-medium tracking-wide group"
                    data-testid="checkout-btn"
                  >
                    {t.checkout}
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    onClick={closeCart}
                    variant="outline"
                    className="w-full border-[#E5E0D8] text-[#3A2F2A] hover:bg-[#E5E0D8] py-4 text-sm"
                  >
                    {t.continueShopping}
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
