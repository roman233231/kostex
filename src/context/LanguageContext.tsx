'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '@/lib/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'uk',
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('uk');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem('kostex-lang') as Language) || 'uk';
    setLangState(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('kostex-lang', lang);
    document.documentElement.lang = lang;
  }, [lang, mounted]);

  const setLang = (newLang: Language) => setLangState(newLang);
  const toggleLang = () => setLangState((p) => (p === 'uk' ? 'en' : 'uk'));

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.uk[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}