import { useState, useEffect } from 'react';
import { translations } from '../utils/constants';

const LANGUAGE_KEY = 'weather-app-language';

export function useLanguage() {
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.fr[key] || key;
  };

  return {
    language,
    changeLanguage,
    t,
    isRTL: language === 'ar'
  };
}