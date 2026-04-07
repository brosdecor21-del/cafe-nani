import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { X, ShoppingBag, Package } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BeansPage = () => {
  const { t, language } = useLanguage();
  const [beans, setBeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBean, setSelectedBean] = useState(null);
  const [cart, setCart] = useState([]);

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

  const addToCart = (bean) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === bean.id);
      if (existing) {
        return prev.map((item) =>
          item.id === bean.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...bean, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const roastLevelColors = {
    Light: 'bg-amber-100 text-amber-800',
    Medium: 'bg-orange-100 text-orange-800',
    'Medium-Dark': 'bg-orange-200 text-orange-900',
    Dark: 'bg-stone-200 text-stone-800',
  };

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
            <p className="overline mb-4">{t('nav.beans')}</p>
            <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl text-[#1A1614] tracking-tight mb-4">
              {t('beans.title')}
            </h1>
            <p className="text-[#2C2420]/70 max-w-xl mx-auto">
              {t('beans.subtitle')}
            </p>
          </motion.div>

          {/* Beans Grid */}
          {loading ? (
            <div className="text-center py-12 text-[#2C2420]/60">
              {t('common.loading')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="beans-full-grid">
              {beans.map((bean, index) => (
                <motion.div
                  key={bean.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Tilt
                    tiltMaxAngleX={8}
                    tiltMaxAngleY={8}
                    scale={1.02}
                    transitionSpeed={400}
                  >
                    <div className="bg-white rounded-sm border border-[#E5E0D8] overflow-hidden h-full">
                      <div 
                        className="aspect-square overflow-hidden cursor-pointer"
                        onClick={() => setSelectedBean(bean)}
                      >
                        <img
                          src={bean.image_url}
                          alt={language === 'hu' ? bean.name_hu : bean.name_en}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-[#2C2420]/60">{bean.origin}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${roastLevelColors[bean.roast_level] || 'bg-gray-100'}`}>
                            {bean.roast_level}
                          </span>
                        </div>
                        <h3 
                          className="font-['Cormorant_Garamond'] text-lg text-[#1A1614] mb-2 cursor-pointer hover:text-[#C07D5A] transition-colors"
                          onClick={() => setSelectedBean(bean)}
                        >
                          {language === 'hu' ? bean.name_hu : bean.name_en}
                        </h3>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {(language === 'hu' ? bean.flavor_notes_hu : bean.flavor_notes_en)
                            .slice(0, 3)
                            .map((note, i) => (
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
                            <span className="font-medium text-[#C07D5A] text-lg">
                              {bean.price.toLocaleString()} Ft
                            </span>
                            <span className="text-xs text-[#2C2420]/50 ml-1">/ {bean.weight}g</span>
                          </div>
                          <Button
                            onClick={() => addToCart(bean)}
                            disabled={!bean.in_stock}
                            className="btn-gold text-xs px-4 py-2"
                            data-testid={`add-to-cart-${bean.id}`}
                          >
                            {bean.in_stock ? t('beans.addToCart') : t('beans.outOfStock')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Tilt>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Preview */}
        <AnimatePresence>
          {cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 right-6 bg-[#1A1614] text-[#F9F6F0] p-4 rounded-sm shadow-2xl z-50"
              data-testid="cart-preview"
            >
              <div className="flex items-center gap-4">
                <ShoppingBag size={20} className="text-[#C07D5A]" />
                <div>
                  <p className="text-sm">{cart.reduce((sum, item) => sum + item.quantity, 0)} termék</p>
                  <p className="font-medium">{cartTotal.toLocaleString()} Ft</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bean Detail Modal */}
        <AnimatePresence>
          {selectedBean && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedBean(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#F9F6F0] rounded-sm max-w-3xl w-full max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
                data-testid="bean-detail-modal"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-square">
                    <img
                      src={selectedBean.image_url}
                      alt={language === 'hu' ? selectedBean.name_hu : selectedBean.name_en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 relative">
                    <button
                      onClick={() => setSelectedBean(null)}
                      className="absolute top-4 right-4 p-2 hover:bg-[#E5E0D8] rounded-sm transition-colors"
                      data-testid="close-modal"
                    >
                      <X size={20} />
                    </button>
                    
                    <p className="overline mb-2">{selectedBean.origin}</p>
                    <h2 className="font-['Cormorant_Garamond'] text-3xl text-[#1A1614] mb-4">
                      {language === 'hu' ? selectedBean.name_hu : selectedBean.name_en}
                    </h2>
                    
                    <p className="text-[#2C2420]/70 mb-6">
                      {language === 'hu' ? selectedBean.description_hu : selectedBean.description_en}
                    </p>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Package size={18} className="text-[#C07D5A]" />
                        <span className="text-sm">
                          <strong>{t('beans.roast')}:</strong> {selectedBean.roast_level}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">{t('beans.notes')}:</p>
                        <div className="flex flex-wrap gap-2">
                          {(language === 'hu' ? selectedBean.flavor_notes_hu : selectedBean.flavor_notes_en).map((note, i) => (
                            <span
                              key={i}
                              className="text-sm px-3 py-1 bg-[#E5E0D8] text-[#2C2420] rounded-sm"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-[#E5E0D8]">
                      <div>
                        <span className="text-2xl font-medium text-[#C07D5A]">
                          {selectedBean.price.toLocaleString()} Ft
                        </span>
                        <span className="text-sm text-[#2C2420]/50 ml-2">/ {selectedBean.weight}g</span>
                      </div>
                      <Button
                        onClick={() => {
                          addToCart(selectedBean);
                          setSelectedBean(null);
                        }}
                        disabled={!selectedBean.in_stock}
                        className="btn-gold px-6 py-3"
                        data-testid="modal-add-to-cart"
                      >
                        {selectedBean.in_stock ? t('beans.addToCart') : t('beans.outOfStock')}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default BeansPage;
