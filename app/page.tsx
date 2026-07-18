import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { JourneySection } from '@/components/landing/JourneySection';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar variant="landing" />
      <main className="flex-1">
        <Hero />
        <JourneySection />
      </main>
      <Footer />
    </div>
  );
}
