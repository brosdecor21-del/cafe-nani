import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Real Café Nani Background (exterior + interior photo)
const HERO_BG_URL = "https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/xzb6n1de_nani.png";

// Precise recreation of original NANI logo hummingbird + serif font
const NaniLogo = ({ className = "", color = "#C9A66B", showCafe = false }) => (
  <svg viewBox="0 0 280 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hummingbird - flying pose with spread wings like original */}
    <g fill={color}>
      {/* Body - oval tilted */}
      <ellipse cx="32" cy="38" rx="16" ry="18" transform="rotate(-15 32 38)" />
      {/* Head - smaller circle */}
      <circle cx="46" cy="24" r="9" />
      {/* Long elegant beak */}
      <path d="M52 22 Q62 18, 78 14 Q62 22, 52 26 Z" />
      {/* Upper wing - spread upward */}
      <path d="M20 30 Q10 20, 4 8 Q14 18, 22 26 Z" />
      {/* Lower wing hint */}
      <path d="M24 44 Q16 48, 10 56 Q18 50, 26 46 Z" opacity="0.8" />
      {/* Tail feathers - elegant fan */}
      <path d="M20 52 Q10 62, 4 74 L8 70 Q14 60, 20 52 Z" />
      <path d="M24 54 Q18 66, 14 76 L18 72 Q22 62, 24 54 Z" />
    </g>
    {/* Text */}
    <g fill={color}>
      {showCafe && (
        <text x="90" y="32" fontFamily="'Cormorant Garamond', Georgia, serif" 
              fontSize="18" fontWeight="400" fontStyle="italic" letterSpacing="2">
          Café
        </text>
      )}
      <text x="90" y={showCafe ? "62" : "52"} 
            fontFamily="'Cormorant Garamond', Georgia, serif" 
            fontSize="44" fontWeight="500" letterSpacing="4">
        NANI
      </text>
    </g>
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
        {/* SVG Logo - matching original style, transparent background */}
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
            <NaniLogo className="h-20 md:h-28 w-auto mx-auto" showCafe={true} />
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
