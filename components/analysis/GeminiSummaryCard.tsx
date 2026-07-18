'use client';

import Link from 'next/link';
import { Cpu } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';
import { DashboardMetrics } from '@/lib/dashboardMetrics';
import { useLanguage } from '@/hooks/useLanguage';
import { GlassCard } from '@/components/ui/GlassCard';

interface GeminiSummaryCardProps {
  result: AnalysisResult;
  metrics: DashboardMetrics;
  uploadId?: string;
}

export function GeminiSummaryCard({ result, metrics, uploadId }: GeminiSummaryCardProps) {
  const { dict } = useLanguage();
  const suffix = uploadId ? `?uploadId=${uploadId}` : '';

  const perf =
    metrics.performance === 'excellent'
      ? dict.dashboard.perfExcellent
      : metrics.performance === 'moderate'
        ? dict.dashboard.perfModerate
        : dict.dashboard.perfWeak;

  const docName = result.fileName ?? '—';
  // "fintech-payments" -> "PAYMENTS" (the specific sub-sector)
  const sectorParts = (result.sector ?? 'fintech-payments').split('-');
  const sector = sectorParts[sectorParts.length - 1].toUpperCase();

  return (
    <GlassCard className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-text">{dict.dashboard.geminiDataTitle}</h3>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary-light">
          <Cpu size={18} />
        </div>
      </div>

      <p className="truncate text-lg font-bold text-text" title={docName}>
        {docName}
      </p>
      <p className="mt-1 text-sm text-text-muted">{perf}</p>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
        <Link
          href={`/analysis/detail/risks${suffix}`}
          className="rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-white/25 hover:bg-white/10"
        >
          <p className="text-xs text-text-muted">{dict.dashboard.risksDetected}</p>
          <p className="mt-1 font-bold text-danger">
            {metrics.gapCount} {dict.dashboard.risksUnit}
          </p>
        </Link>
        <Link
          href={`/analysis/detail/sector${suffix}`}
          className="rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-white/25 hover:bg-white/10"
        >
          <p className="text-xs text-text-muted">{dict.dashboard.sectorLabel}</p>
          <p className="mt-1 font-bold text-success-light" dir="ltr">
            {sector}
          </p>
        </Link>
      </div>
    </GlassCard>
  );
}
