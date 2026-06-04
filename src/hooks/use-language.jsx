import { useEffect, useState } from 'react';

export function useLanguage() {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved) return saved;
      // Default to German ('de')
      return 'de';
    }
    return 'de';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Synchronize state across different hook instances
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

  const toggleLanguage = () => {
    const nextLanguage = language === 'de' ? 'en' : 'de';
    setLanguage(nextLanguage);
    localStorage.setItem('language', nextLanguage);
    window.dispatchEvent(new Event('language-change'));
  };

  return [language, toggleLanguage];
}
