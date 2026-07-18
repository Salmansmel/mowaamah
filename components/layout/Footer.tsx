'use client';

import { useLanguage } from '@/hooks/useLanguage';

export function Footer() {
  const { dict } = useLanguage();

  return (
    <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-text-muted">
      <p>
        © {new Date().getFullYear()} {dict.nav.brand}. {dict.hero.trustLabel} PDPL · CMA · SAMA
      </p>
    </footer>
  );
}
