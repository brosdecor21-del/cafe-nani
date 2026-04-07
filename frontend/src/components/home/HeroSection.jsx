import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// SVG Hummingbird for Hero
const HummingbirdHero = ({ className = "" }) => (
  <svg 
    viewBox="0 0 200 80" 
    className={className}
    fill="currentColor"
  >
    {/* Hummingbird silhouette - larger for hero */}
    <g transform="translate(0, 10)">
      <path d="M15 35 Q25 12, 35 22 Q42 10, 38 26 Q48 18, 42 30 Q56 26, 46 35 Q60 34, 46 42 L38 42 Q34 52, 22 65 L18 60 Q14 52, 14 44 Q6 42, 15 35" />
      {/* Beak */}
      <path d="M46 34 L62 30 L46 38 Z" />
    </g>
    {/* NANI text */}
    <text x="70" y="52" fontFamily="'Cormorant Garamond', serif" fontSize="42" fontWeight="400" letterSpacing="-2">
      NANI
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
        value: ['#C07D5A', '#8A9A86', '#2C2420'],
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
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1727081979210-ff973479b458?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBjYWZlJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzc1NTY4NDkyfDA&ixlib=rb-4.1.0&q=85"
          alt="Café Nani Interior"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F9F6F0]/80 via-[#F9F6F0]/60 to-[#F9F6F0]" />
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
        {/* Animated Logo */}
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
            <HummingbirdHero className="h-24 md:h-32 w-auto mx-auto text-[#1A1614]" />
          </motion.div>
        </motion.div>

        {/* Café text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="overline mb-4"
        >
          CAFÉ
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl text-[#2C2420]/80 mb-8 max-w-xl mx-auto"
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
          <ChevronDown size={24} className="text-[#2C2420]/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
