import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';

function Footer() {
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
            <h3>Clinic Queue System</h3>
            <p>Professional healthcare management for modern clinics</p>
            <div className="footer-contact">
              <div className="contact-item">
                <Phone size={16} />
                <span>+996 (312) 123-456</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>info@clinic.kg</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Bishkek, Kyrgyzstan</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/register">Book Appointment</a></li>
              <li><a href="/login">Doctor Login</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Working Hours</h4>
            <div className="hours-item">
              <Clock size={16} />
              <span>Mon-Fri: 8:00 AM - 6:00 PM</span>
            </div>
            <div className="hours-item">
              <Clock size={16} />
              <span>Sat: 9:00 AM - 2:00 PM</span>
            </div>
            <div className="hours-item">
              <Clock size={16} />
              <span>Sunday: Closed</span>
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
