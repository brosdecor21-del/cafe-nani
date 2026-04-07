import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, UtensilsCrossed, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ExperienceCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(26, 22, 20, 0.1)' }}
    className="bg-white p-8 rounded-sm border border-[#E5E0D8] transition-all duration-300"
  >
    <div className="w-12 h-12 bg-[#F9F6F0] rounded-sm flex items-center justify-center mb-6">
      <Icon size={24} className="text-[#C07D5A]" />
    </div>
    <h3 className="font-['Cormorant_Garamond'] text-xl mb-3 text-[#1A1614]">{title}</h3>
    <p className="text-[#2C2420]/70 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const ExperienceSection = () => {
  const { t } = useLanguage();

  const experiences = [
    {
      icon: Coffee,
      title: t('experience.specialty.title'),
      description: t('experience.specialty.desc'),
    },
    {
      icon: UtensilsCrossed,
      title: t('experience.fresh.title'),
      description: t('experience.fresh.desc'),
    },
    {
      icon: Sparkles,
      title: t('experience.modern.title'),
      description: t('experience.modern.desc'),
    },
  ];

  return (
    <section className="py-24 bg-[#F9F6F0]" data-testid="experience-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="overline mb-4">{t('experience.title')}</p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-[#1A1614] tracking-tight">
            Café Nani
          </h2>
        </motion.div>

        {/* Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={exp.title}
              icon={exp.icon}
              title={exp.title}
              description={exp.description}
              delay={index * 0.15}
            />
          ))}
        </div>

        {/* Feature Images */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="img-zoom rounded-sm overflow-hidden aspect-square">
            <img
              src="https://images.unsplash.com/photo-1759259639667-af32680c21a4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwyfHxiYXJpc3RhJTIwcG91cmluZyUyMGZsYXQlMjB3aGl0ZSUyMGxhdHRlJTIwYXJ0fGVufDB8fHx8MTc3NTU2ODQ5Mnww&ixlib=rb-4.1.0&q=85"
              alt="Latte Art"
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
              alt="Fresh Juice"
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
  );
};

export default ExperienceSection;
