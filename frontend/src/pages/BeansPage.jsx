import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { X, ShoppingBag, Package, Minus, Plus, Truck, Store } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BeanDetailModal = ({ bean, isOpen, onClose, language }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!bean) return null;

  const name = language === 'hu' ? bean.name_hu : bean.name_en;
  const description = language === 'hu' ? bean.description_hu : bean.description_en;
  const flavorNotes = language === 'hu' ? bean.flavor_notes_hu : bean.flavor_notes_en;

  const handleAddToCart = () => {
    addToCart({
      ...bean,
      type: 'bean',
      quantity,
      finalPrice: bean.price,
    });
    toast.success(
      language === 'hu' ? 'Hozzaadva a kosarhoz!' : 'Added to cart!',
      { description: `${quantity}x ${name} (${bean.weight}g)` }
    );
    onClose();
  };

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
          data-testid="bean-modal-overlay"
        >
          <motion.div
            className="absolute inset-0 bg-[#1A1614]/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl mx-4 bg-[#F8F5F0] rounded-sm overflow-hidden max-h-[90vh] overflow-y-auto"
            data-testid="bean-modal-content"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-3 bg-[#1A1614]/80 hover:bg-[#1A1614] text-white rounded-full transition-colors"
              data-testid="bean-modal-close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <motion.div
                className="relative aspect-square lg:aspect-auto lg:h-full min-h-[300px]"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <img
                  src={bean.image_url}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614]/30 to-transparent lg:bg-gradient-to-r" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-4 left-4 px-4 py-2 bg-[#C8A97E] text-[#1A1614] text-xs font-medium uppercase tracking-wider rounded-sm"
                >
                  {bean.origin}
                </motion.div>
              </motion.div>

              {/* Content */}
              <div className="p-8 lg:p-12 flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-[#C8A97E] mb-2">
                    {bean.roast_level} {language === 'hu' ? 'porkoles' : 'roast'}
                  </p>
                  <h2 className="font-['Cormorant_Garamond'] text-3xl lg:text-4xl text-[#3A2F2A] mb-2">
                    {name}
                  </h2>
                  <p className="text-2xl font-medium text-[#C8A97E]">
                    {bean.price.toLocaleString()} Ft
                    <span className="text-sm text-[#3A2F2A]/50 ml-2">/ {bean.weight}g</span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="h-px bg-gradient-to-r from-transparent via-[#C8A97E] to-transparent my-6"
                />

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="text-[#3A2F2A]/80 leading-relaxed mb-6"
                >
                  {description}
                </motion.p>

                {/* Flavor Notes */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-6"
                >
                  <p className="text-xs uppercase tracking-wider text-[#C8A97E] mb-3">
                    {language === 'hu' ? 'Izjegyek' : 'Flavor Notes'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {flavorNotes.map((note, i) => (
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

                {/* Delivery Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="mb-6 space-y-3"
                >
                  <p className="text-xs uppercase tracking-wider text-[#C8A97E] mb-3">
                    {language === 'hu' ? 'Szallitasi opciok' : 'Delivery Options'}
                  </p>
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center gap-3 p-3 bg-white border border-[#E5E0D8] rounded-sm">
                      <Truck size={18} className="text-[#C8A97E] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[#3A2F2A]">
                          {language === 'hu' ? 'Hazhoz szallitas' : 'Home Delivery'}
                        </p>
                        <p className="text-xs text-[#3A2F2A]/50">
                          {language === 'hu' ? '1-2 munkanap' : '1-2 business days'}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-3 p-3 bg-white border border-[#E5E0D8] rounded-sm">
                      <Store size={18} className="text-[#C8A97E] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[#3A2F2A]">
                          {language === 'hu' ? 'Helyben atveheto' : 'Store Pickup'}
                        </p>
                        <p className="text-xs text-[#3A2F2A]/50">
                          {language === 'hu' ? 'Azonnal' : 'Immediately'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quantity Selector */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mb-8"
                >
                  <p className="text-xs uppercase tracking-wider text-[#C8A97E] mb-3">
                    {language === 'hu' ? 'Mennyiseg' : 'Quantity'}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-[#E5E0D8] rounded-sm hover:border-[#C8A97E] transition-colors"
                      data-testid="bean-quantity-minus"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-xl font-medium text-[#3A2F2A] w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-[#E5E0D8] rounded-sm hover:border-[#C8A97E] transition-colors"
                      data-testid="bean-quantity-plus"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </motion.div>

                <div className="flex-grow" />

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    onClick={handleAddToCart}
                    disabled={!bean.in_stock}
                    className="flex-1 bg-[#C8A97E] hover:bg-[#B8996E] text-[#1A1614] py-4 text-sm font-medium tracking-wide transition-all hover:scale-[1.02]"
                    data-testid="bean-modal-add-to-cart"
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    {bean.in_stock
                      ? `${language === 'hu' ? 'Kosarba' : 'Add to Cart'} — ${(bean.price * quantity).toLocaleString()} Ft`
                      : (language === 'hu' ? 'Elfogyott' : 'Out of Stock')}
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-[#3A2F2A]/20 text-[#3A2F2A] hover:bg-[#3A2F2A] hover:text-[#F8F5F0] py-4 text-sm font-medium tracking-wide transition-all"
                    data-testid="bean-modal-back-btn"
                  >
                    {language === 'hu' ? 'Vissza' : 'Back'}
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

const roastLevelColors = {
  Light: 'bg-amber-100 text-amber-800',
  Medium: 'bg-orange-100 text-orange-800',
  'Medium-Dark': 'bg-orange-200 text-orange-900',
  Dark: 'bg-stone-200 text-stone-800',
};

const BeanCard = ({ bean, index, language, onClick }) => {
  const flavorNotes = language === 'hu' ? bean.flavor_notes_hu : bean.flavor_notes_en;
  const name = language === 'hu' ? bean.name_hu : bean.name_en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.02} transitionSpeed={400}>
        <motion.div
          whileHover={{
            y: -8,
            boxShadow: '0 25px 50px rgba(200, 169, 126, 0.15)',
          }}
          onClick={() => onClick(bean)}
          className="bg-white rounded-sm border border-[#E5E0D8] overflow-hidden h-full cursor-pointer group relative"
          data-testid={`bean-card-${bean.id}`}
        >
          <motion.div
            className="absolute inset-0 rounded-sm pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ boxShadow: 'inset 0 0 0 2px rgba(200, 169, 126, 0.5)' }}
          />

          <div className="aspect-square overflow-hidden">
            <motion.img
              src={bean.image_url}
              alt={name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[#2C2420]/60">{bean.origin}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${roastLevelColors[bean.roast_level] || 'bg-gray-100'}`}>
                {bean.roast_level}
              </span>
            </div>
            <h3 className="font-['Cormorant_Garamond'] text-lg text-[#1A1614] mb-2 group-hover:text-[#C8A97E] transition-colors">
              {name}
            </h3>
            <div className="flex flex-wrap gap-1 mb-4">
              {flavorNotes.slice(0, 3).map((note, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-[#F5F0E8] text-[#2C2420]/70 rounded-sm"
                >
                  {note}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-[#C8A97E] text-lg">
                  {bean.price.toLocaleString()} Ft
                </span>
                <span className="text-xs text-[#2C2420]/50 ml-1">/ {bean.weight}g</span>
              </div>
            </div>
            <motion.p
              className="text-xs text-[#C8A97E] mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {language === 'hu' ? 'Kattints a reszletekert' : 'Click for details'}
            </motion.p>
          </div>
        </motion.div>
      </Tilt>
    </motion.div>
  );
};

const BeansPage = () => {
  const { t, language } = useLanguage();
  const [beans, setBeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBean, setSelectedBean] = useState(null);

  useEffect(() => {
    const fetchBeans = async () => {
      try {
        const response = await axios.get(`${API}/coffee-beans`);
        setBeans(response.data);
      } catch (error) {
        console.error('Failed to fetch beans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBeans();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F6F0]" data-testid="beans-page">
      <Header />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs uppercase tracking-[0.3em] text-[#C8A97E] mb-4"
            >
              {t('nav.beans')}
            </motion.p>
            <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl text-[#1A1614] tracking-tight mb-4">
              {t('beans.title')}
            </h1>
            <p className="text-[#2C2420]/70 max-w-xl mx-auto">
              {t('beans.subtitle')}
            </p>

            {/* Delivery / Pickup info banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-6 mt-8"
            >
              <div className="flex items-center gap-2 text-sm text-[#3A2F2A]/70">
                <Truck size={16} className="text-[#C8A97E]" />
                <span>{language === 'hu' ? 'Hazhoz szallitas' : 'Home Delivery'}</span>
              </div>
              <div className="w-px h-4 bg-[#E5E0D8]" />
              <div className="flex items-center gap-2 text-sm text-[#3A2F2A]/70">
                <Store size={16} className="text-[#C8A97E]" />
                <span>{language === 'hu' ? 'Helyben atveheto' : 'Store Pickup'}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Beans Grid */}
          {loading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-[#C8A97E] border-t-transparent rounded-full mx-auto"
              />
              <p className="text-[#3A2F2A]/60 mt-4">{t('common.loading')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="beans-full-grid">
              {beans.map((bean, index) => (
                <BeanCard
                  key={bean.id}
                  bean={bean}
                  index={index}
                  language={language}
                  onClick={setSelectedBean}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bean Detail Modal */}
      <BeanDetailModal
        bean={selectedBean}
        isOpen={!!selectedBean}
        onClose={() => setSelectedBean(null)}
        language={language}
      />

      <Footer />
    </div>
  );
};

export default BeansPage;
