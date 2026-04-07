import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ContactPreview = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-[#1A1614]" data-testid="contact-preview-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-sm overflow-hidden">
              <img
                src="https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/xzb6n1de_nani.png"
                alt="Café Nani Interior"
                className="w-full h-full object-cover object-right"
              />
            </div>
            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-8 -right-8 bg-[#C07D5A] p-6 rounded-sm hidden md:block"
            >
              <p className="text-white font-['Cormorant_Garamond'] text-2xl">★ 4.8</p>
              <p className="text-white/80 text-sm mt-1">Google Rating</p>
            </motion.div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="overline mb-4 text-[#C07D5A]">{t('nav.contact')}</p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-[#F9F6F0] tracking-tight mb-8">
              {t('hero.welcome')}
            </h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#2C2420] rounded-sm flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#C07D5A]" />
                </div>
                <div>
                  <p className="text-[#F9F6F0] font-medium">{t('contact.info.address')}</p>
                  <p className="text-[#E5E0D8]/70 text-sm mt-1">
                    Budapest, Klapka u. 4–6, 1134
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#2C2420] rounded-sm flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-[#C07D5A]" />
                </div>
                <div>
                  <p className="text-[#F9F6F0] font-medium">{t('contact.info.phone')}</p>
                  <a
                    href="tel:+36203599296"
                    className="text-[#E5E0D8]/70 text-sm mt-1 hover:text-[#C07D5A] transition-colors"
                  >
                    +36 20 359 9296
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#2C2420] rounded-sm flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-[#C07D5A]" />
                </div>
                <div>
                  <p className="text-[#F9F6F0] font-medium">{t('contact.info.hours')}</p>
                  <div className="text-[#E5E0D8]/70 text-sm mt-1">
                    <p>H-P: 8:00 - 18:00</p>
                    <p>Szo: 9:00 - 16:00</p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-[#C07D5A] font-medium hover:gap-3 transition-all"
              data-testid="contact-preview-link"
            >
              {t('contact.subtitle')}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactPreview;
