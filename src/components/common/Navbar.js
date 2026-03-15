import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Phone, User, Stethoscope, Calendar, Globe } from 'lucide-react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { getText, LANGUAGES } from '../../utils/helpers';

const Navbar = ({ onHelpClick }) => {
  const { language, switchLanguage } = useLanguageContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isDoctorRoute = location.pathname === '/doctor';

  const navItems = isDoctorRoute 
    ? [
        { name: getText(language, 'doctorDashboardTitle'), path: '/doctor', icon: Stethoscope },
        { name: getText(language, 'home'), path: '/', icon: Calendar },
      ]
    : [
        { name: getText(language, 'home'), path: '/', icon: Calendar },
        { name: getText(language, 'register'), path: '/register', icon: User },
        { name: getText(language, 'doctorLogin'), path: '/login', icon: Stethoscope },
      ];

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="logo-content"
          >
            <Calendar className="logo-icon" />
            <span className="logo-text">
              {getText(language, 'clinicName')}
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-desktop">
          <div className="nav-links">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="navbar-actions">
            <div className="language-selector">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => switchLanguage('en')}
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                title="English"
              >
                <span className="flag-icon">🇺🇸</span>
                <span className="lang-text">EN</span>
              </motion.button>
              
              <div className="lang-separator">|</div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => switchLanguage('ru')}
                className={`lang-btn ${language === 'ru' ? 'active' : ''}`}
                title="Русский"
              >
                <span className="flag-icon">🇷🇺</span>
                <span className="lang-text">RU</span>
              </motion.button>
              
              <div className="lang-separator">|</div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => switchLanguage('kg')}
                className={`lang-btn ${language === 'kg' ? 'active' : ''}`}
                title="Кыргызча"
              >
                <span className="flag-icon">🇰🇬</span>
                <span className="lang-text">KG</span>
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHelpClick}
              className="help-btn"
            >
              <Phone size={18} />
              <span>{getText(language, 'help')}</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="mobile-menu"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMenuOpen ? 'auto' : 0, 
          opacity: isMenuOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="mobile-menu-content">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="mobile-actions">
            <div className="mobile-language-selector">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => switchLanguage('en')}
                className={`mobile-lang-btn ${language === 'en' ? 'active' : ''}`}
                title="English"
              >
                <span className="flag-icon">🇺🇸</span>
                <span className="lang-text">EN</span>
              </motion.button>
              
              <div className="mobile-lang-separator">|</div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => switchLanguage('ru')}
                className={`mobile-lang-btn ${language === 'ru' ? 'active' : ''}`}
                title="Русский"
              >
                <span className="flag-icon">🇷🇺</span>
                <span className="lang-text">RU</span>
              </motion.button>
              
              <div className="mobile-lang-separator">|</div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => switchLanguage('kg')}
                className={`mobile-lang-btn ${language === 'kg' ? 'active' : ''}`}
                title="Кыргызча"
              >
                <span className="flag-icon">🇰🇬</span>
                <span className="lang-text">KG</span>
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onHelpClick();
                setIsMenuOpen(false);
              }}
              className="mobile-help-btn"
            >
              <Phone size={20} />
              <span>{getText(language, 'help')}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
