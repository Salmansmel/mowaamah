import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { TrustBadges } from '@/components/landing/TrustBadges';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar variant="landing" />
      <main className="flex-1">
        <Hero />
        <TrustBadges />
      </main>
      <Footer />
    </div>
  );
}
