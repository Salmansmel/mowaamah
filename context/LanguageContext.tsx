'use client';

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { dictionaries, Lang, Dictionary } from '@/lib/i18n';

interface LanguageContextValue {
  lang: Lang;
  dict: Dictionary;
  dir: 'rtl' | 'ltr';
  toggleLanguage: () => void;
  setLanguage: (lang: Lang) => void;
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'mowaamah:lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === 'ar' || stored === 'en') {
      setLang(stored);
    }
  }, []);

  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.classList.toggle('font-inter', lang === 'en');
    document.body.classList.toggle('font-cairo', lang === 'ar');
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const value: LanguageContextValue = {
    lang,
    dict: dictionaries[lang],
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    toggleLanguage,
    setLanguage: setLang,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
