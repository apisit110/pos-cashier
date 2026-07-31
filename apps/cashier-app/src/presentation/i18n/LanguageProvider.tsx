import React, { useState } from 'react';
import { LanguageContext } from './LanguageContext';
import type { Language } from './LanguageContext';
import { en, th } from './translations';

const LANGUAGE_STORAGE_KEY = 'lightning_pos_language';

const dictionaries = { en, th };

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'th';
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === 'th' || stored === 'en' ? stored : 'th';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: dictionaries[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};
