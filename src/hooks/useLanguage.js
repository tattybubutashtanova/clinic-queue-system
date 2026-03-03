import { useState } from 'react';
import { getNextLanguage } from '../utils/helpers';

export const useLanguage = (initialLang = 'en') => {
  const [language, setLanguage] = useState(initialLang);

  const switchLanguage = () => {
    setLanguage(getNextLanguage(language));
  };

  return {
    language,
    setLanguage,
    switchLanguage,
  };
};
