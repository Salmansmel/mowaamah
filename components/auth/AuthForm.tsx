'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Lock } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/lib/firestore';
import { useLanguage } from '@/hooks/useLanguage';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

function getErrorCode(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code: unknown }).code);
  }
  return null;
}

function mapAuthError(error: unknown, dict: ReturnType<typeof useLanguage>['dict']): string {
  switch (getErrorCode(error)) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return dict.auth.errorInvalidCredential;
    case 'auth/email-already-in-use':
      return dict.auth.errorEmailInUse;
    case 'auth/weak-password':
      return dict.auth.errorWeakPassword;
    default:
      return dict.auth.errorGeneric;
  }
}

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { dict } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/upload';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(credential.user.uid, email);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push(redirectTo);
    } catch (err) {
      setError(mapAuthError(err, dict));
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="mx-auto w-full max-w-md p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary-light">
          <Lock size={22} />
        </div>
        <h1 className="text-lg font-semibold text-text">{dict.auth.nafathHeader}</h1>
        <p className="mt-1 text-sm text-text-muted">{dict.auth.nafathCaption}</p>
      </div>

      <h2 className="mb-4 text-center text-xl font-bold text-text">
        {mode === 'login' ? dict.auth.loginTitle : dict.auth.signupTitle}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm text-text-muted">{dict.auth.emailLabel}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-text outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-text-muted">{dict.auth.passwordLabel}</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-text outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-2 w-full">
          {loading ? dict.common.loading : mode === 'login' ? dict.auth.loginSubmit : dict.auth.signupSubmit}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-muted">
        {mode === 'login' ? (
          <>
            {dict.auth.noAccount}{' '}
            <a href="/signup" className="text-primary-light hover:underline">
              {dict.auth.goSignup}
            </a>
          </>
        ) : (
          <>
            {dict.auth.haveAccount}{' '}
            <a href="/login" className="text-primary-light hover:underline">
              {dict.auth.goLogin}
            </a>
          </>
        )}
      </p>
    </GlassCard>
  );
}
