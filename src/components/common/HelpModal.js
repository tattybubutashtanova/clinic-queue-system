import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { getText } from '../../utils/helpers';

const HelpModal = ({ isOpen, onClose }) => {
  const { language } = useLanguageContext();

  const contactInfo = {
    phone: '+996 (312) 123-456',
    email: 'support@narynclinic.kg',
    address: 'Naryn City, Medical Center',
    hours: 'Mon-Fri: 8:00-18:00, Sat: 9:00-15:00'
  };

  const faqItems = [
    {
      question: getText(language, 'faqQueueQuestion'),
      answer: getText(language, 'faqQueueAnswer')
    },
    {
      question: getText(language, 'faqRegistrationQuestion'),
      answer: getText(language, 'faqRegistrationAnswer')
    },
    {
      question: getText(language, 'faqDoctorQuestion'),
      answer: getText(language, 'faqDoctorAnswer')
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content help-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <h2 className="modal-title">
              <MessageCircle size={24} />
              {getText(language, 'helpTitle')}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="close-btn"
            >
              <X size={20} />
            </motion.button>
          </div>

          <div className="modal-body">
            {/* Contact Information */}
            <div className="help-section">
              <h3>{getText(language, 'contactInfo')}</h3>
              <div className="contact-grid">
                <motion.div 
                  className="contact-card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Phone className="contact-icon" />
                  <div>
                    <strong>{getText(language, 'phone')}</strong>
                    <p>{contactInfo.phone}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="contact-card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Mail className="contact-icon" />
                  <div>
                    <strong>{getText(language, 'email')}</strong>
                    <p>{contactInfo.email}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="contact-card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <MapPin className="contact-icon" />
                  <div>
                    <strong>{getText(language, 'address')}</strong>
                    <p>{contactInfo.address}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="contact-card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Clock className="contact-icon" />
                  <div>
                    <strong>{getText(language, 'hours')}</strong>
                    <p>{contactInfo.hours}</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="help-section">
              <h3>{getText(language, 'frequentlyAskedQuestions')}</h3>
              <div className="faq-list">
                {faqItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="faq-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h4>{item.question}</h4>
                    <p>{item.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <motion.div 
              className="emergency-contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="emergency-icon">🚨</div>
              <div>
                <h4>{getText(language, 'emergencyTitle')}</h4>
                <p>{getText(language, 'emergencyText')}</p>
                <a href={`tel:${contactInfo.phone}`} className="emergency-btn">
                  <Phone size={16} />
                  {getText(language, 'callNow')}
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HelpModal;
