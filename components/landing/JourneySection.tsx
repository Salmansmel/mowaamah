'use client';

import { motion } from 'framer-motion';
import { Trophy, Award, Crown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { GlassCard } from '@/components/ui/GlassCard';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

export function JourneySection() {
  const { dict } = useLanguage();
  const j = dict.journey;

  const steps = [
    {
      icon: Trophy,
      title: j.step1Title,
      body: j.step1Body,
      image: '/images/journey-1.jpg',
    },
    {
      icon: Award,
      title: j.step2Title,
      body: j.step2Body,
      image: '/images/journey-2.jpg',
    },
    {
      icon: Crown,
      title: j.step3Title,
      body: j.step3Body,
      image: '/images/journey-3.jpg',
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-20">
      <motion.div
        className="pointer-events-none absolute start-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-success/15 blur-[130px]"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center text-2xl font-bold text-text sm:text-3xl"
        >
          {j.title}
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.15 }}
            >
              <GlassCard className="flex h-full flex-col gap-4 p-6">
                {step.image && (
                  <ImageWithFallback
                    src={step.image}
                    alt={step.title}
                    placeholderText={j.imagePlaceholder}
                  />
                )}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success-light">
                  <step.icon size={22} />
                </div>
                <h3 className="font-semibold text-text">{step.title}</h3>
                <p className="text-sm text-text-muted">{step.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
