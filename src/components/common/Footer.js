import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { getText } from '../../utils/helpers';

function Footer() {
  const { language } = useLanguageContext();
  
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{getText(language, 'clinicName')}</h3>
            <p>{getText(language, 'clinicDescription')}</p>
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={16} />
                <span>{getText(language, 'phone')}: +996 (312) 123-456</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>{getText(language, 'email')}: info@clinic.kg</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>{getText(language, 'address')}: Bishkek, Kyrgyzstan</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>{getText(language, 'quickLinks')}</h4>
            <ul className="footer-links">
              <li><a href="/">{getText(language, 'home')}</a></li>
              <li><a href="/register">{getText(language, 'register')}</a></li>
              <li><a href="/login">{getText(language, 'doctorLogin')}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{getText(language, 'workingHours')}</h4>
            <div className="hours-item">
              <Clock size={16} />
              <span>{getText(language, 'mondayFriday')}</span>
            </div>
            <div className="hours-item">
              <Clock size={16} />
              <span>{getText(language, 'saturday')}</span>
            </div>
            <div className="hours-item">
              <Clock size={16} />
              <span>{getText(language, 'sunday')}</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Clinic Queue System. Made with <Heart size={14} /> for better healthcare.</p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
