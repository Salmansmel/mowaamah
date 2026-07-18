'use client';

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export function Navbar({ variant = 'landing' }: { variant?: 'landing' | 'app' }) {
  const { dict } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await signOut(auth);
    router.push('/');
  }

  return (
    <header className="glass sticky top-0 z-40 w-full border-x-0 border-t-0">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="text-xl font-bold text-text">
          {dict.nav.brand}
        </a>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageToggle />
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
            >
              <LogOut size={16} />
              {dict.nav.logout}
            </button>
          ) : variant === 'landing' ? (
            <>
              <a href="/about" className="text-sm text-text-muted transition-colors hover:text-text">
                {dict.nav.about}
              </a>
              <a href="/login" className="text-sm text-text-muted transition-colors hover:text-text">
                {dict.nav.login}
              </a>
              <Button href="/upload" glow className="text-sm">
                {dict.nav.startProject}
              </Button>
            </>
          ) : null}
        </div>

        <button
          className="text-text md:hidden"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-4 md:hidden">
          <LanguageToggle />
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-text-muted"
            >
              <LogOut size={16} />
              {dict.nav.logout}
            </button>
          ) : (
            <>
              <a href="/about" className="text-sm text-text-muted">
                {dict.nav.about}
              </a>
              <a href="/login" className="text-sm text-text-muted">
                {dict.nav.login}
              </a>
              <Button href="/upload" className="text-sm">
                {dict.nav.startProject}
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
