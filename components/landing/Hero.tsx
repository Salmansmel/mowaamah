'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const { dict } = useLanguage();

  return (
    <section className="relative overflow-hidden px-6 py-28 text-center">
      <motion.div
        className="pointer-events-none absolute start-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/30 blur-[120px]"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute end-1/4 top-40 h-[300px] w-[300px] rounded-full bg-success/20 blur-[100px]"
        animate={{ opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-3xl"
      >
        <h1 className="bg-gradient-to-r from-text via-primary-light to-success-light bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-5xl md:text-6xl">
          {dict.hero.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-text-muted">{dict.hero.subheadline}</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/upload" glow variant="primary" className="px-8 py-4 text-base">
            {dict.hero.ctaPrimary}
          </Button>
          <Button href="/about" variant="secondary" className="px-8 py-4 text-base">
            {dict.hero.ctaSecondary}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
