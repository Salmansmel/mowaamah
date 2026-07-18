'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Crown, GraduationCap, Maximize2, ImageOff } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { GlassCard } from '@/components/ui/GlassCard';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Modal } from '@/components/ui/Modal';

function ModalImage({ src, alt, placeholderText }: { src: string; alt: string; placeholderText: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-text-muted">
        <ImageOff size={28} />
        <span className="text-xs">{placeholderText}</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-[60vh] w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function JourneySection() {
  const { dict } = useLanguage();
  const j = dict.journey;
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      icon: Trophy,
      title: j.step1Title,
      body: j.step1Body,
      detail: j.step1Detail,
      image: '/images/journey-1.jpg',
    },
    {
      icon: Award,
      title: j.step2Title,
      body: j.step2Body,
      detail: j.step2Detail,
      image: '/images/journey-2.jpg',
    },
    {
      icon: Crown,
      title: j.step3Title,
      body: j.step3Body,
      detail: j.step3Detail,
      image: '/images/journey-3.jpg',
    },
    {
      icon: GraduationCap,
      title: j.step4Title,
      body: j.step4Body,
      detail: j.step4Detail,
      image: '/images/journey-4.jpg',
    },
  ];

  const openStep = activeStep !== null ? steps[activeStep] : null;

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
            >
              <button
                type="button"
                onClick={() => setActiveStep(i)}
                className="group block h-full w-full text-start"
              >
                <GlassCard className="flex h-full flex-col gap-4 p-6 transition-colors group-hover:border-white/25">
                  <div className="relative">
                    {step.image && (
                      <ImageWithFallback
                        src={step.image}
                        alt={step.title}
                        placeholderText={j.imagePlaceholder}
                      />
                    )}
                    <div className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <Maximize2 size={14} />
                    </div>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success-light">
                    <step.icon size={22} />
                  </div>
                  <h3 className="font-semibold text-text">{step.title}</h3>
                  <p className="text-sm text-text-muted">{step.body}</p>
                  <span className="mt-auto text-xs font-medium text-primary-light">
                    {j.viewDetails} ›
                  </span>
                </GlassCard>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal isOpen={activeStep !== null} onClose={() => setActiveStep(null)}>
        {openStep && (
          <div className="flex flex-col gap-5">
            {openStep.image && (
              <ModalImage
                key={activeStep}
                src={openStep.image}
                alt={openStep.title}
                placeholderText={j.imagePlaceholder}
              />
            )}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success-light">
              <openStep.icon size={22} />
            </div>
            <h3 className="text-xl font-bold text-text">{openStep.title}</h3>
            <p className="leading-relaxed text-text-muted">{openStep.detail}</p>
          </div>
        )}
      </Modal>
    </section>
  );
}
