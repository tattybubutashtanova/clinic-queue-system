import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Phone, User, Stethoscope, Calendar } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { getText } from '../../utils/helpers';

const Navbar = ({ onHelpClick }) => {
  const { language, switchLanguage } = useLanguage();
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
        { name: 'Book Appointment', path: '/register', icon: User },
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={switchLanguage}
              className="lang-btn"
            >
              {language.toUpperCase()}
            </motion.button>

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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={switchLanguage}
              className="mobile-lang-btn"
            >
              {language.toUpperCase()}
            </motion.button>

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
