import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNextLanguage } from '../utils/helpers';

const LanguageContext = createContext();

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to 'en'
    return localStorage.getItem('clinic-language') || 'en';
  });

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('clinic-language', language);
  }, [language]);

  const switchLanguage = (newLang) => {
    if (newLang) {
      setLanguage(newLang);
    } else {
      setLanguage(getNextLanguage(language));
    }
  };

  const value = {
    language,
    setLanguage,
    switchLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
