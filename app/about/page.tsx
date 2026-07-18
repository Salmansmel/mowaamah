'use client';

import { motion } from 'framer-motion';
import { Upload, FileSearch, Sparkles, Gauge, FileCheck, Compass, Telescope } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TrustBadges } from '@/components/landing/TrustBadges';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';

export default function AboutPage() {
  const { dict } = useLanguage();
  const a = dict.about;

  const steps = [
    { icon: Upload, title: a.step1Title, body: a.step1Body },
    { icon: FileSearch, title: a.step2Title, body: a.step2Body },
    { icon: Sparkles, title: a.step3Title, body: a.step3Body },
    { icon: Gauge, title: a.step4Title, body: a.step4Body },
    { icon: FileCheck, title: a.step5Title, body: a.step5Body },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar variant="landing" />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-24 text-center">
          <motion.div
            className="pointer-events-none absolute start-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto max-w-3xl"
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary-light">
              {a.eyebrow}
            </p>
            <h1 className="bg-gradient-to-r from-text via-primary-light to-success-light bg-clip-text text-3xl font-extrabold leading-tight text-transparent sm:text-4xl md:text-5xl">
              {a.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted">{a.intro}</p>
          </motion.div>
        </section>

        {/* Problem */}
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <GlassCard className="p-8 md:p-10">
            <h2 className="mb-3 text-2xl font-bold text-text">{a.problemTitle}</h2>
            <p className="text-text-muted">{a.problemBody}</p>
          </GlassCard>
        </section>

        {/* Mission / Vision */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassCard className="h-full p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
                  <Compass size={24} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-text">{a.missionTitle}</h3>
                <p className="text-text-muted">{a.missionBody}</p>
              </GlassCard>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard className="h-full p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success/15 text-success-light">
                  <Telescope size={24} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-text">{a.visionTitle}</h3>
                <p className="text-text-muted">{a.visionBody}</p>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-text">{a.howTitle}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                <GlassCard className="h-full p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
                    <step.icon size={24} />
                  </div>
                  <h3 className="mb-2 font-semibold text-text">{step.title}</h3>
                  <p className="text-sm text-text-muted">{step.body}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
          <h2 className="mb-2 text-xl font-bold text-text">{a.trustTitle}</h2>
          <TrustBadges />
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
          <h2 className="mb-6 text-2xl font-bold text-text">{a.ctaTitle}</h2>
          <Button href="/upload" glow variant="primary" className="px-8 py-4 text-base">
            {a.ctaButton}
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
