import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Real Café Nani Background (exterior + interior photo)
const HERO_BG_URL = "https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/xzb6n1de_nani.png";

// Custom Café Nani Hero Logo - Large golden version
const CafeNaniHeroLogo = ({ className = "" }) => (
  <svg viewBox="0 0 280 80" className={className} fill="none">
    {/* Hummingbird - larger for hero */}
    <g fill="#C9A66B">
      {/* Body */}
      <path d="M15 40c0-12 9-22 18-18 3-6 9-9 12-6 4-3 9-1.5 9 3 6-1.5 9 1.5 7.5 6 4.5 1.5 6 6 3 9l-9 1.5c-3 12-12 21-21 27l-6-6c-6-4.5-9-10.5-9-16.5h-4.5z" />
      {/* Beak */}
      <path d="M52.5 31.5l18-4.5-18 9z" />
    </g>
    {/* Café Nani Text */}
    <text x="78" y="52" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="38" fontWeight="500" fill="#C9A66B" letterSpacing="-1">
      Café Nani
    </text>
  </svg>
);

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
        {/* Animated SVG Logo - No background */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CafeNaniHeroLogo className="h-20 md:h-28 w-auto mx-auto drop-shadow-2xl" />
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
