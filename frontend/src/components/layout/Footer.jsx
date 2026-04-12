import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Original NANI logo
const LOGO_URL = "https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/h6dh4udx_nani1.png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1A1614] text-[#F9F6F0] pt-16 pb-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img 
              src={LOGO_URL} 
              alt="NANI" 
              className="h-16 w-auto mb-4"
              style={{ mixBlendMode: 'screen' }}
            />
            <p className="text-[#E5E0D8] text-sm leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#2C2420] rounded-full hover:bg-[#C07D5A] transition-colors"
                data-testid="footer-instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#2C2420] rounded-full hover:bg-[#C07D5A] transition-colors"
                data-testid="footer-facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="overline mb-6 text-[#C07D5A]">{t('nav.menu')}</h4>
            <nav className="space-y-3">
              <Link
                to="/"
                className="block text-[#E5E0D8] hover:text-[#C07D5A] transition-colors text-sm"
                data-testid="footer-link-home"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/menu"
                className="block text-[#E5E0D8] hover:text-[#C07D5A] transition-colors text-sm"
                data-testid="footer-link-menu"
              >
                {t('nav.menu')}
              </Link>
              <Link
                to="/beans"
                className="block text-[#E5E0D8] hover:text-[#C07D5A] transition-colors text-sm"
                data-testid="footer-link-beans"
              >
                {t('nav.beans')}
              </Link>
              <Link
                to="/about"
                className="block text-[#E5E0D8] hover:text-[#C07D5A] transition-colors text-sm"
                data-testid="footer-link-about"
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/contact"
                className="block text-[#E5E0D8] hover:text-[#C07D5A] transition-colors text-sm"
                data-testid="footer-link-contact"
              >
                {t('nav.contact')}
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="overline mb-6 text-[#C07D5A]">{t('nav.contact')}</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#C07D5A] mt-0.5 flex-shrink-0" />
                <p className="text-[#E5E0D8] text-sm">
                  Budapest, Klapka u. 4–6, 1134
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#C07D5A] flex-shrink-0" />
                <a
                  href="tel:+36203599296"
                  className="text-[#E5E0D8] hover:text-[#C07D5A] transition-colors text-sm"
                  data-testid="footer-phone"
                >
                  +36 20 359 9296
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-[#C07D5A] mt-0.5 flex-shrink-0" />
                <div className="text-[#E5E0D8] text-sm">
                  <p>H-P: 8:00 - 18:00</p>
                  <p>Szo: 9:00 - 16:00</p>
                  <p>V: Zárva</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2C2420]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#E5E0D8] text-xs">
              © {new Date().getFullYear()} Café Nani. {t('footer.rights')}
            </p>
            <a
              href="https://nani.cafe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C07D5A] text-xs hover:underline"
              data-testid="footer-website"
            >
              nani.cafe
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
