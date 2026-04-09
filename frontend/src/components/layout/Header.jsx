import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Precise recreation of original NANI logo
const NaniLogo = ({ className = "", color = "#C9A66B" }) => (
  <svg viewBox="0 0 200 55" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hummingbird - flying pose */}
    <g fill={color}>
      {/* Body */}
      <ellipse cx="24" cy="28" rx="12" ry="13" transform="rotate(-15 24 28)" />
      {/* Head */}
      <circle cx="34" cy="18" r="7" />
      {/* Beak */}
      <path d="M39 16 Q46 14, 56 11 Q46 17, 39 19 Z" />
      {/* Wing */}
      <path d="M15 22 Q8 15, 4 6 Q10 14, 16 20 Z" />
      {/* Tail */}
      <path d="M15 38 Q8 46, 4 54 L7 51 Q11 44, 15 38 Z" />
      <path d="M18 40 Q13 48, 10 56 L13 52 Q16 46, 18 40 Z" />
    </g>
    {/* NANI text */}
    <text x="64" y="36" fontFamily="'Cormorant Garamond', Georgia, serif" 
          fontSize="32" fontWeight="500" letterSpacing="3" fill={color}>
      NANI
    </text>
  </svg>
);

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/menu', label: t('nav.menu') },
    { path: '/beans', label: t('nav.beans') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-header shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="header-logo">
            <NaniLogo className="h-9 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-link-${item.path.replace('/', '') || 'home'}`}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isActive(item.path)
                    ? 'text-[#C07D5A]'
                    : 'text-[#2C2420] hover:text-[#C07D5A]'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C07D5A]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Language Switcher & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="lang-switch" data-testid="language-switcher">
              <button
                onClick={() => setLanguage('hu')}
                className={language === 'hu' ? 'active' : ''}
                data-testid="lang-hu"
              >
                HU
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'active' : ''}
                data-testid="lang-en"
              >
                EN
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#1A1614]"
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#F9F6F0] border-t border-[#E5E0D8]"
            data-testid="mobile-nav"
          >
            <div className="px-6 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`mobile-nav-link-${item.path.replace('/', '') || 'home'}`}
                  className={`block py-3 text-lg font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-[#C07D5A]'
                      : 'text-[#2C2420]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
