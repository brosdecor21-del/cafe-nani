import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BeanCard = ({ bean, index, language }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      scale={1.02}
      transitionSpeed={400}
      className="h-full"
    >
      <div className="bg-white rounded-sm border border-[#E5E0D8] overflow-hidden h-full card-3d">
        <div className="aspect-square overflow-hidden">
          <img
            src={bean.image_url}
            alt={language === 'hu' ? bean.name_hu : bean.name_en}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="p-6">
          <p className="overline text-xs mb-2">{bean.origin}</p>
          <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1614] mb-2">
            {language === 'hu' ? bean.name_hu : bean.name_en}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {(language === 'hu' ? bean.flavor_notes_hu : bean.flavor_notes_en)
              .slice(0, 2)
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
            <span className="font-medium text-[#C07D5A]">
              {bean.price.toLocaleString()} Ft
            </span>
            <span className="text-xs text-[#2C2420]/60">{bean.weight}g</span>
          </div>
        </div>
      </div>
    </Tilt>
  </motion.div>
);

const BeansPreview = () => {
  const { t, language } = useLanguage();
  const [beans, setBeans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeans = async () => {
      try {
        const response = await axios.get(`${API}/coffee-beans`);
        setBeans(response.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch beans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeans();
  }, []);

  return (
    <section className="py-24 bg-[#F9F6F0]" data-testid="beans-preview-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <p className="overline mb-4">{t('nav.beans')}</p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-[#1A1614] tracking-tight">
              {t('beans.title')}
            </h2>
          </div>
          <Link
            to="/beans"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-[#C07D5A] font-medium hover:gap-3 transition-all"
            data-testid="beans-see-all"
          >
            {t('common.seeAll')}
            <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* Beans Grid */}
        {loading ? (
          <div className="text-center py-12 text-[#2C2420]/60">
            {t('common.loading')}
          </div>
        ) : beans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="beans-grid">
            {beans.map((bean, index) => (
              <BeanCard
                key={bean.id}
                bean={bean}
                index={index}
                language={language}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#2C2420]/60">No beans available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BeansPreview;
