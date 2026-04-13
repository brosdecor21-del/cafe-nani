import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Coffee, Minus, Plus } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Tasting notes data for items
const tastingNotes = {
  'Flat White': { hu: ['Csokoládé', 'Karamell', 'Pirított dió'], en: ['Chocolate', 'Caramel', 'Toasted nuts'] },
  'Café Cortado': { hu: ['Intenzív', 'Karamell', 'Citrus'], en: ['Intense', 'Caramel', 'Citrus'] },
  'V60 Filter Kávé': { hu: ['Virágos', 'Gyümölcsös', 'Tiszta'], en: ['Floral', 'Fruity', 'Clean'] },
  'Dirty Chai': { hu: ['Fűszeres', 'Krémes', 'Aromás'], en: ['Spicy', 'Creamy', 'Aromatic'] },
};

// Menu Item Card Component
const MenuItemCard = ({ item, index, language, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.03, 
        y: -8,
        boxShadow: '0 25px 50px rgba(200, 169, 126, 0.15)',
      }}
      onClick={() => onClick(item)}
      className="bg-white rounded-sm border border-[#E5E0D8] overflow-hidden cursor-pointer group relative"
      data-testid={`menu-item-${item.id}`}
    >
      {/* Golden glow on hover */}
      <motion.div 
        className="absolute inset-0 rounded-sm pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ 
          boxShadow: 'inset 0 0 0 2px rgba(200, 169, 126, 0.5)',
        }}
      />
      
      <div className="aspect-video overflow-hidden">
        <motion.img
          src={item.image_url}
          alt={language === 'hu' ? item.name_hu : item.name_en}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-['Cormorant_Garamond'] text-xl text-[#3A2F2A] group-hover:text-[#C8A97E] transition-colors">
              {language === 'hu' ? item.name_hu : item.name_en}
            </h3>
            <p className="text-sm text-[#3A2F2A]/60 mt-1 line-clamp-2">
              {language === 'hu' ? item.description_hu : item.description_en}
            </p>
          </div>
          <span className="font-medium text-[#C8A97E] whitespace-nowrap text-lg">
            {item.price} Ft
          </span>
        </div>
        
        {/* View details hint */}
        <motion.p 
          className="text-xs text-[#C8A97E] mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {language === 'hu' ? 'Kattints a részletekért →' : 'Click for details →'}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Full Screen Modal Component
const MenuItemModal = ({ item, isOpen, onClose, language, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  
  const sizes = {
    small: { hu: 'Kicsi', en: 'Small', priceModifier: -100 },
    medium: { hu: 'Közepes', en: 'Medium', priceModifier: 0 },
    large: { hu: 'Nagy', en: 'Large', priceModifier: 150 },
  };

  const notes = tastingNotes[item?.name_en] || { hu: ['Gazdag', 'Aromás'], en: ['Rich', 'Aromatic'] };
  const finalPrice = item ? item.price + sizes[selectedSize].priceModifier : 0;

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
          data-testid="menu-modal-overlay"
        >
          {/* Glassmorphism Background */}
          <motion.div 
            className="absolute inset-0 bg-[#1A1614]/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl mx-4 bg-[#F8F5F0] rounded-sm overflow-hidden max-h-[90vh] overflow-y-auto"
            data-testid="menu-modal-content"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-3 bg-[#1A1614]/80 hover:bg-[#1A1614] text-white rounded-full transition-colors"
              data-testid="modal-close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Section */}
              <motion.div 
                className="relative aspect-square lg:aspect-auto lg:h-full min-h-[300px]"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <img
                  src={item.image_url}
                  alt={language === 'hu' ? item.name_hu : item.name_en}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614]/30 to-transparent lg:bg-gradient-to-r" />
                
                {/* Category badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-4 left-4 px-4 py-2 bg-[#C8A97E] text-[#1A1614] text-xs font-medium uppercase tracking-wider rounded-sm"
                >
                  {item.category === 'coffee' ? (language === 'hu' ? 'Kávé' : 'Coffee') :
                   item.category === 'food' ? (language === 'hu' ? 'Étel' : 'Food') :
                   (language === 'hu' ? 'Ital' : 'Drink')}
                </motion.div>
              </motion.div>

              {/* Content Section */}
              <div className="p-8 lg:p-12 flex flex-col">
                {/* Title & Price */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="font-['Cormorant_Garamond'] text-3xl lg:text-4xl text-[#3A2F2A] mb-2">
                    {language === 'hu' ? item.name_hu : item.name_en}
                  </h2>
                  <p className="text-2xl font-medium text-[#C8A97E]">
                    {finalPrice} Ft
                  </p>
                </motion.div>

                {/* Elegant Divider */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="h-px bg-gradient-to-r from-transparent via-[#C8A97E] to-transparent my-6"
                />

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="text-[#3A2F2A]/80 leading-relaxed mb-6"
                >
                  {language === 'hu' ? item.description_hu : item.description_en}
                </motion.p>

                {/* Tasting Notes */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-6"
                >
                  <p className="text-xs uppercase tracking-wider text-[#C8A97E] mb-3">
                    {language === 'hu' ? 'Ízjegyek' : 'Tasting Notes'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(language === 'hu' ? notes.hu : notes.en).map((note, i) => (
                      <motion.span
                        key={note}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="px-3 py-1.5 bg-[#3A2F2A]/5 text-[#3A2F2A] text-sm rounded-sm"
                      >
                        {note}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Size Selector (for coffee/drinks) */}
                {(item.category === 'coffee' || item.category === 'drinks') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                    className="mb-6"
                  >
                    <p className="text-xs uppercase tracking-wider text-[#C8A97E] mb-3">
                      {language === 'hu' ? 'Méret' : 'Size'}
                    </p>
                    <div className="flex gap-3">
                      {Object.entries(sizes).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedSize(key)}
                          className={`flex-1 py-3 px-4 rounded-sm text-sm font-medium transition-all ${
                            selectedSize === key
                              ? 'bg-[#3A2F2A] text-[#F8F5F0]'
                              : 'bg-white border border-[#E5E0D8] text-[#3A2F2A] hover:border-[#C8A97E]'
                          }`}
                          data-testid={`size-${key}`}
                        >
                          {language === 'hu' ? value.hu : value.en}
                          {value.priceModifier !== 0 && (
                            <span className="block text-xs opacity-70">
                              {value.priceModifier > 0 ? '+' : ''}{value.priceModifier} Ft
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Quantity Selector */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mb-8"
                >
                  <p className="text-xs uppercase tracking-wider text-[#C8A97E] mb-3">
                    {language === 'hu' ? 'Mennyiség' : 'Quantity'}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-[#E5E0D8] rounded-sm hover:border-[#C8A97E] transition-colors"
                      data-testid="quantity-minus"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-xl font-medium text-[#3A2F2A] w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-[#E5E0D8] rounded-sm hover:border-[#C8A97E] transition-colors"
                      data-testid="quantity-plus"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </motion.div>

                {/* Spacer */}
                <div className="flex-grow" />

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    onClick={() => {
                      onAddToCart({ ...item, size: selectedSize, quantity, finalPrice: finalPrice * quantity });
                      onClose();
                    }}
                    className="flex-1 bg-[#C8A97E] hover:bg-[#B8996E] text-[#1A1614] py-4 text-sm font-medium tracking-wide transition-all hover:scale-[1.02]"
                    data-testid="modal-add-to-cart"
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    {language === 'hu' ? 'Kosárba' : 'Add to Cart'} — {finalPrice * quantity} Ft
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-[#3A2F2A]/20 text-[#3A2F2A] hover:bg-[#3A2F2A] hover:text-[#F8F5F0] py-4 text-sm font-medium tracking-wide transition-all"
                    data-testid="modal-back-btn"
                  >
                    {language === 'hu' ? 'Vissza a Menübe' : 'Back to Menu'}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Cart Preview Component
const CartPreview = ({ cart, language }) => {
  const total = cart.reduce((sum, item) => sum + (item.finalPrice || item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {cart.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-6 right-6 bg-[#1A1614] text-[#F8F5F0] p-5 rounded-sm shadow-2xl z-40"
          data-testid="cart-preview"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#C8A97E] rounded-sm flex items-center justify-center">
              <ShoppingBag size={20} className="text-[#1A1614]" />
            </div>
            <div>
              <p className="text-sm text-[#F8F5F0]/70">
                {itemCount} {language === 'hu' ? 'tétel' : 'items'}
              </p>
              <p className="text-lg font-medium">{total.toLocaleString()} Ft</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MenuPage = () => {
  const { t, language } = useLanguage();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${API}/menu`);
        setMenuItems(response.data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const categories = ['all', 'coffee', 'food', 'drinks'];
  
  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity, finalPrice: i.finalPrice + item.finalPrice }
            : i
        );
      }
      return [...prev, item];
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0]" data-testid="menu-page">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs uppercase tracking-[0.3em] text-[#C8A97E] mb-4"
            >
              {t('nav.menu')}
            </motion.p>
            <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl text-[#3A2F2A] tracking-tight mb-4">
              {t('menu.title')}
            </h1>
            <p className="text-[#3A2F2A]/70 max-w-xl mx-auto">
              {t('menu.subtitle')}
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center gap-3 mb-12 flex-wrap"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => setActiveCategory(category)}
                data-testid={`category-${category}`}
                className={`px-6 py-2.5 text-sm font-medium rounded-sm transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#3A2F2A] text-[#F8F5F0] shadow-lg'
                    : 'bg-white text-[#3A2F2A] border border-[#E5E0D8] hover:border-[#C8A97E] hover:shadow-md'
                }`}
              >
                {t(`menu.categories.${category}`)}
              </motion.button>
            ))}
          </motion.div>

          {/* Menu Grid */}
          {loading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-[#C8A97E] border-t-transparent rounded-full mx-auto"
              />
              <p className="text-[#3A2F2A]/60 mt-4">{t('common.loading')}</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              data-testid="menu-grid"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    language={language}
                    onClick={setSelectedItem}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-[#3A2F2A]/60"
            >
              {language === 'hu' ? 'Nincs elem ebben a kategóriában' : 'No items in this category'}
            </motion.div>
          )}
        </div>
      </main>

      {/* Full Screen Modal */}
      <MenuItemModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        language={language}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Preview */}
      <CartPreview cart={cart} language={language} />

      <Footer />
    </div>
  );
};

export default MenuPage;
