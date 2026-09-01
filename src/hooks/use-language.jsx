import { useEffect, useState, useCallback } from 'react';
import { translations } from '../lib/translations';

export function useLanguage() {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved === 'de' || saved === 'en') return saved;
      return 'de';
    }
    return 'de';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Synchronize state across different hook instances and browser storage
  useEffect(() => {
    const handleLanguageChange = () => {
      const saved = localStorage.getItem('language') || 'de';
      setLanguage(saved);
    };
    window.addEventListener('storage', handleLanguageChange);
    window.addEventListener('language-change', handleLanguageChange);
    
    return () => {
      window.removeEventListener('storage', handleLanguageChange);
      window.removeEventListener('language-change', handleLanguageChange);
    };
  }, []);

  const toggleLanguage = useCallback(() => {
    const nextLanguage = language === 'de' ? 'en' : 'de';
    setLanguage(nextLanguage);
    localStorage.setItem('language', nextLanguage);
    window.dispatchEvent(new Event('language-change'));
  }, [language]);

  const t = translations[language] || translations.de;

  // Supports both [language, toggleLanguage, t] and { language, toggleLanguage, t }
  const result = [language, toggleLanguage, t];
  result.language = language;
  result.toggleLanguage = toggleLanguage;
  result.t = t;

  return result;
}
