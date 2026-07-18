'use client';

import { motion } from 'framer-motion';
import { ChartColumn } from 'lucide-react';
import { RiskSimBar } from '@/lib/dashboardMetrics';
import { useLanguage } from '@/hooks/useLanguage';
import { GlassCard } from '@/components/ui/GlassCard';

interface RiskSimulationCardProps {
  bars: RiskSimBar[];
  onShowDetails: () => void;
}

export function RiskSimulationCard({ bars, onShowDetails }: RiskSimulationCardProps) {
  const { dict } = useLanguage();

  return (
    <GlassCard className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-text">{dict.dashboard.riskSimTitle}</h3>
        <ChartColumn size={18} className="text-primary-light" />
      </div>

      <div className="flex flex-1 items-end justify-center gap-4" style={{ minHeight: 140 }} dir="ltr">
        {bars.map((bar) => (
          <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-[120px] w-full items-end justify-center">
              <motion.div
                className="w-8 rounded-t-md"
                style={{ backgroundColor: bar.color, boxShadow: `0 0 12px ${bar.color}66` }}
                initial={{ height: 0 }}
                animate={{ height: `${bar.value}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[10px] font-medium tracking-wider text-text-muted">{bar.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onShowDetails}
        className="mt-4 self-start text-sm text-primary-light transition-colors hover:text-primary"
      >
        {dict.dashboard.details} ›
      </button>
    </GlassCard>
  );
}
