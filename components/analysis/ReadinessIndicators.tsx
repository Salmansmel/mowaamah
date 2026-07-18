'use client';

import Link from 'next/link';
import { Activity, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReadinessIndicator } from '@/lib/dashboardMetrics';
import { MetricSlug } from '@/lib/detailConfig';
import { useLanguage } from '@/hooks/useLanguage';
import { GlassCard } from '@/components/ui/GlassCard';

const slugByLabel: Record<ReadinessIndicator['labelKey'], MetricSlug> = {
  indGovernance: 'governance',
  indDataProtection: 'data-protection',
  indSecurity: 'security',
  indOverall: 'overall',
};

export function ReadinessIndicators({
  indicators,
  uploadId,
}: {
  indicators: ReadinessIndicator[];
  uploadId?: string;
}) {
  const { dict } = useLanguage();
  const suffix = uploadId ? `?uploadId=${uploadId}` : '';

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6 flex items-center gap-2">
        <Activity size={18} className="text-primary-light" />
        <h2 className="text-lg font-bold text-text">{dict.dashboard.indicatorsTitle}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {indicators.map((ind) => (
          <Link
            key={ind.labelKey}
            href={`/analysis/detail/${slugByLabel[ind.labelKey]}${suffix}`}
            className="group rounded-xl border border-transparent p-3 text-center transition-colors hover:border-white/15 hover:bg-white/5"
          >
            <p className="text-3xl font-extrabold" style={{ color: ind.color }}>
              {ind.value}%
            </p>
            <p className="mt-1 mb-3 flex items-center justify-center gap-1 text-sm text-text-muted">
              {dict.dashboard[ind.labelKey]}
              <ChevronLeft
                size={14}
                className="opacity-0 transition-opacity group-hover:opacity-100 rtl:rotate-180"
              />
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: ind.color, boxShadow: `0 0 12px ${ind.color}aa` }}
                initial={{ width: 0 }}
                animate={{ width: `${ind.value}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}
