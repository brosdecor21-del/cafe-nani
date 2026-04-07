import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Real NANI Logo Image (golden hummingbird on white)
const LOGO_URL = "https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/pwrd2zmm_Gemini_Generated_Image_865jqc865jqc865j.png";
// Real Café Nani Background (exterior + interior photo)
const HERO_BG_URL = "https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/xzb6n1de_nani.png";

const HeroSection = () => {
  const { t } = useLanguage();
  const [particlesLoaded, setParticlesLoaded] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
    setParticlesLoaded(true);
  }, []);

  // Steam/coffee particle effect configuration
  const particlesOptions = {
    fullScreen: false,
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: ['#C9A66B', '#D4B87A', '#F9F6F0'],
      },
      move: {
        direction: 'top',
        enable: true,
        outModes: {
          default: 'out',
        },
        random: true,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 40,
      },
      opacity: {
        value: { min: 0.1, max: 0.4 },
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.1,
        },
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 2, max: 6 },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 1,
        },
      },
    },
    detectRetina: true,
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F9F6F0]"
      data-testid="hero-section"
    >
      {/* Real Café Nani Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG_URL}
          alt="Café Nani"
          className="w-full h-full object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1614]/70 via-[#1A1614]/50 to-[#1A1614]/80" />
      </div>

      {/* Particles container */}
      <div className="particles-container">
        <Particles
          id="heroParticles"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Animated Real Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-6"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="bg-white/95 backdrop-blur-sm px-8 py-6 rounded-sm shadow-2xl inline-block"
          >
            <img 
              src={LOGO_URL} 
              alt="Café Nani" 
              className="h-16 md:h-20 w-auto"
            />
          </motion.div>
        </motion.div>

        {/* Café text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="overline mb-4 text-[#C9A66B]"
        >
          CAFÉ
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl text-[#F9F6F0]/90 mb-8 max-w-xl mx-auto"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Link
            to="/menu"
            className="btn-gold inline-flex items-center px-8 py-4 text-sm tracking-wider font-medium rounded-sm"
            data-testid="hero-cta"
          >
            {t('hero.cta')}
          </Link>
        </motion.div>

        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex items-center justify-center gap-2 text-sm text-[#2C2420]/60"
        >
          <span>Budapest, Klapka u. 4–6</span>
          <span className="w-1 h-1 rounded-full bg-[#C07D5A]" />
          <span>★ 4.8</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={24} className="text-[#F9F6F0]/60" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
