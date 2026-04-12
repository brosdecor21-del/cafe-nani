import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Original NANI logo (black bg removed with screen blend)
const LOGO_URL = "https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/h6dh4udx_nani1.png";
// Real Café Nani Background
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
      {/* Real Café Nani Background - darker overlay for better contrast */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG_URL}
          alt="Café Nani"
          className="w-full h-full object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0806]/85 via-[#1A1614]/75 to-[#0A0806]/90" />
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
        {/* Original Logo - screen blend removes black background */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 4px 30px rgba(201,166,107,0.4))' }}
          >
            <img 
              src={LOGO_URL} 
              alt="NANI" 
              className="h-32 md:h-44 w-auto mx-auto"
              style={{ mixBlendMode: 'screen' }}
            />
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
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
