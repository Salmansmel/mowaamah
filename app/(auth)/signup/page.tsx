import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { AuthForm } from '@/components/auth/AuthForm';
import { FullScreenLoader } from '@/components/layout/FullScreenLoader';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar variant="landing" />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <Suspense fallback={<FullScreenLoader />}>
          <AuthForm mode="signup" />
        </Suspense>
      </main>
    </div>
  );
}
