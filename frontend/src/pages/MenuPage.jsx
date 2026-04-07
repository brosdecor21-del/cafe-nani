import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const MenuPage = () => {
  const { t, language } = useLanguage();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

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

  return (
    <div className="min-h-screen bg-[#F9F6F0]" data-testid="menu-page">
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
            <p className="overline mb-4">{t('nav.menu')}</p>
            <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl text-[#1A1614] tracking-tight mb-4">
              {t('menu.title')}
            </h1>
            <p className="text-[#2C2420]/70 max-w-xl mx-auto">
              {t('menu.subtitle')}
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center gap-4 mb-12 flex-wrap"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                data-testid={`category-${category}`}
                className={`px-6 py-2 text-sm font-medium rounded-sm transition-all ${
                  activeCategory === category
                    ? 'bg-[#1A1614] text-[#F9F6F0]'
                    : 'bg-white text-[#2C2420] border border-[#E5E0D8] hover:border-[#C07D5A]'
                }`}
              >
                {t(`menu.categories.${category}`)}
              </button>
            ))}
          </motion.div>

          {/* Menu Grid */}
          {loading ? (
            <div className="text-center py-12 text-[#2C2420]/60">
              {t('common.loading')}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="menu-grid">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-sm border border-[#E5E0D8] overflow-hidden card-3d"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={language === 'hu' ? item.name_hu : item.name_en}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1614]">
                          {language === 'hu' ? item.name_hu : item.name_en}
                        </h3>
                        <p className="text-sm text-[#2C2420]/60 mt-1">
                          {language === 'hu' ? item.description_hu : item.description_en}
                        </p>
                      </div>
                      <span className="font-medium text-[#C07D5A] whitespace-nowrap">
                        {item.price} Ft
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#2C2420]/60">
              {t('common.loading')}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MenuPage;
