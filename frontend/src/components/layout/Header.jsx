import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Original NANI logo with black background (screen blend makes black transparent)
const LOGO_URL = "https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/h6dh4udx_nani1.png";

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
      className="fixed top-0 left-0 right-0 z-50 bg-[#1A1614]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Original with screen blend to remove black background */}
          <Link to="/" className="flex items-center" data-testid="header-logo">
            <img 
              src={LOGO_URL} 
              alt="NANI" 
              className="h-14 w-auto"
              style={{ mixBlendMode: 'screen' }}
            />
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
                    ? 'text-[#C9A66B]'
                    : 'text-[#C9A66B]/80 hover:text-[#C9A66B]'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C9A66B]"
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
            <div className="flex bg-[#2C2420] rounded-full p-1 gap-1" data-testid="language-switcher">
              <button
                onClick={() => setLanguage('hu')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  language === 'hu' 
                    ? 'bg-[#C9A66B] text-[#1A1614]' 
                    : 'text-[#C9A66B]/70 hover:text-[#C9A66B]'
                }`}
                data-testid="lang-hu"
              >
                HU
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  language === 'en' 
                    ? 'bg-[#C9A66B] text-[#1A1614]' 
                    : 'text-[#C9A66B]/70 hover:text-[#C9A66B]'
                }`}
                data-testid="lang-en"
              >
                EN
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#C9A66B]"
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
            className="md:hidden bg-[#1A1614] border-t border-[#2C2420]"
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
                      ? 'text-[#C9A66B]'
                      : 'text-[#C9A66B]/70'
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
