import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  const addToCart = useCallback((item) => {
    setLastAddedItem(item);
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === item.id && i.size === item.size
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (item.quantity || 1),
        };
        return updated;
      }
      
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    
    // Clear last added item after animation
    setTimeout(() => setLastAddedItem(null), 1000);
  }, []);

  const removeFromCart = useCallback((itemId, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === itemId && item.size === size)));
  }, []);

  const updateQuantity = useCallback((itemId, size, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, size);
      return;
    }
    
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getItemCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const getSubtotal = useCallback(() => {
    return cart.reduce((sum, item) => {
      const price = item.finalPrice || item.price;
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  
  const openCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
