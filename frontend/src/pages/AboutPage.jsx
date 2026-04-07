import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, Users } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Coffee,
      title: t('about.values.quality.title'),
      description: t('about.values.quality.desc'),
    },
    {
      icon: Heart,
      title: t('about.values.passion.title'),
      description: t('about.values.passion.desc'),
    },
    {
      icon: Users,
      title: t('about.values.community.title'),
      description: t('about.values.community.desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F6F0]" data-testid="about-page">
      <Header />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="overline mb-4">{t('nav.about')}</p>
              <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl text-[#1A1614] tracking-tight mb-6">
                {t('about.subtitle')}
              </h1>
              <p className="text-lg text-[#2C2420]/70 leading-relaxed">
                {t('about.story')}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-sm overflow-hidden">
                <img
                  src="https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/xzb6n1de_nani.png"
                  alt="Café Nani"
                  className="w-full h-full object-cover object-left"
                />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#C9A66B] rounded-sm hidden lg:block" />
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-[#1A1614] py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-[#F9F6F0] tracking-tight">
                Értékeink
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-[#2C2420] rounded-sm flex items-center justify-center mx-auto mb-6">
                    <value.icon size={28} className="text-[#C07D5A]" />
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#F9F6F0] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-[#E5E0D8]/70 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="img-zoom rounded-sm overflow-hidden aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1727081979210-ff973479b458?w=600"
                  alt="Café interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="img-zoom rounded-sm overflow-hidden aspect-square">
                <img
                  src="https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/jloifxqj_Gemini_Generated_Image_7j1lw47j1lw47j1l.png"
                  alt="Sandwich"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="img-zoom rounded-sm overflow-hidden aspect-square">
                <img
                  src="https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/04x0rjmk_Gemini_Generated_Image_2mta4k2mta4k2mta.png"
                  alt="Fresh juice"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="img-zoom rounded-sm overflow-hidden aspect-square">
                <img
                  src="https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/etgdjdsi_Gemini_Generated_Image_9wt2k49wt2k49wt2.png"
                  alt="Cookies"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-[#F5F0E8] py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-[#1A1614] tracking-tight mb-8">
                Café Nani
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="overline text-[#C07D5A] mb-2">Cím</p>
                  <p className="text-[#2C2420]">Budapest, Klapka u. 4–6, 1134</p>
                </div>
                <div>
                  <p className="overline text-[#C07D5A] mb-2">Telefon</p>
                  <a href="tel:+36203599296" className="text-[#2C2420] hover:text-[#C07D5A] transition-colors">
                    +36 20 359 9296
                  </a>
                </div>
                <div>
                  <p className="overline text-[#C07D5A] mb-2">Értékelés</p>
                  <p className="text-[#2C2420]">★ 4.8 (69 vélemény)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
