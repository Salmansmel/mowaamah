'use client';

import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:border-white/30 hover:text-text"
      aria-label="Toggle language"
    >
      <Globe size={16} />
      {lang === 'ar' ? 'EN' : 'ع'}
    </button>
  );
}
