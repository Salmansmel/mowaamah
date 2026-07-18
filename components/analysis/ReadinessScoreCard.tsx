'use client';

import Link from 'next/link';
import { AnalysisResult } from '@/lib/types';
import { DashboardMetrics } from '@/lib/dashboardMetrics';
import { useLanguage } from '@/hooks/useLanguage';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScoreRing } from './ScoreRing';

interface ReadinessScoreCardProps {
  result: AnalysisResult;
  metrics: DashboardMetrics;
  uploadId?: string;
}

export function ReadinessScoreCard({ result, metrics, uploadId }: ReadinessScoreCardProps) {
  const { dict } = useLanguage();

  const badge =
    metrics.readiness === 'high'
      ? { label: dict.dashboard.readinessHigh, cls: 'border-success/40 text-success-light' }
      : metrics.readiness === 'medium'
        ? { label: dict.dashboard.readinessMedium, cls: 'border-warning/40 text-warning' }
        : { label: dict.dashboard.readinessLow, cls: 'border-danger/40 text-danger' };

  const href = uploadId ? `/analysis/detail/overall?uploadId=${uploadId}` : '/analysis/detail/overall';

  return (
    <Link href={href} className="block h-full">
      <GlassCard className="flex h-full flex-col items-center justify-center gap-4 p-6 transition-colors hover:border-white/20">
        <ScoreRing score={result.overallScore} size={170} label={dict.dashboard.scoreLabel} />
        <span className={`rounded-full border px-4 py-1.5 text-sm font-medium ${badge.cls}`}>
          {badge.label}
        </span>
      </GlassCard>
    </Link>
  );
}
