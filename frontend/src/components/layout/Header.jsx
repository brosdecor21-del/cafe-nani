import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Custom Café Nani Logo Component - Golden Hummingbird with transparent background
const CafeNaniLogo = ({ className = "", color = "#C9A66B" }) => (
  <svg viewBox="0 0 200 50" className={className} fill="none">
    {/* Hummingbird */}
    <g fill={color}>
      {/* Body */}
      <path d="M12 25c0-8 6-15 12-12 2-4 6-6 8-4 3-2 6-1 6 2 4-1 6 1 5 4 3 1 4 4 2 6l-6 1c-2 8-8 14-14 18l-4-4c-4-3-6-7-6-11h-3z" />
      {/* Beak */}
      <path d="M35 21l12-3-12 6z" />
      {/* Wing detail */}
      <path d="M18 18c2-3 5-5 8-4m-6 8c2-2 4-3 7-2" stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>
    </g>
    {/* Café Nani Text */}
    <text x="52" y="34" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="26" fontWeight="500" fill={color} letterSpacing="-0.5">
      Café Nani
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
            <CafeNaniLogo className="h-10 w-auto" />
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
