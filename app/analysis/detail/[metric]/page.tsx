'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { FullScreenLoader } from '@/components/layout/FullScreenLoader';
import { RiskCategoryCard } from '@/components/analysis/RiskCategoryCard';
import { GapAnalysisTable } from '@/components/analysis/GapAnalysisTable';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAnalysisResult } from '@/hooks/useAnalysisResult';
import { useLanguage } from '@/hooks/useLanguage';
import { isValidMetric, resolveMetric } from '@/lib/detailConfig';

function DetailContent() {
  const { dict } = useLanguage();
  const params = useParams<{ metric: string }>();
  const searchParams = useSearchParams();
  const uploadId = searchParams.get('uploadId');
  const { result, loading } = useAnalysisResult();

  const slug = params.metric;
  if (!isValidMetric(slug)) {
    notFound();
  }

  const backHref = uploadId ? `/analysis?uploadId=${uploadId}` : '/analysis';

  if (loading || !result) {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <div className="mb-8 h-6 w-40 animate-pulse rounded bg-white/5" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </main>
    );
  }

  const { config, value, gaps, contributingCategories } = resolveMetric(slug, result);
  const title = dict.dashboard[config.titleKey];
  const blurb = dict.detail[config.blurbKey];

  const sectorParts = (result.sector ?? 'fintech-payments').split('-');
  const sectorName = sectorParts[sectorParts.length - 1].toUpperCase();

  const valueColor =
    value === undefined ? '#f9fafb' : value >= 71 ? '#10b981' : value >= 41 ? '#f59e0b' : '#ef4444';

  let displayValue: string;
  if (config.valueKind === 'count') displayValue = `${gaps.length} ${dict.dashboard.risksUnit}`;
  else if (config.valueKind === 'sector') displayValue = sectorName;
  else displayValue = `${value ?? 0}%`;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <Link
        href={backHref}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
      >
        <ChevronRight size={16} className="rtl:rotate-180" />
        {dict.detail.back}
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-text sm:text-3xl">{title}</h1>
        <span
          className="text-4xl font-extrabold"
          style={{ color: valueColor }}
          dir={config.valueKind === 'sector' ? 'ltr' : undefined}
        >
          {displayValue}
        </span>
      </div>

      <GlassCard className="mb-10 p-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-light">
          {dict.detail.howComputed}
        </h2>
        <p className="text-text-muted">{blurb}</p>
      </GlassCard>

      {contributingCategories.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-bold text-text">{dict.detail.contributing}</h2>
          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {contributingCategories.map((cat) => (
              <RiskCategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </>
      )}

      <h2 className="mb-4 text-lg font-bold text-text">{dict.detail.relatedGaps}</h2>
      {gaps.length > 0 ? (
        <GapAnalysisTable gaps={gaps} />
      ) : (
        <GlassCard className="p-8 text-center text-success-light">{dict.detail.noGaps}</GlassCard>
      )}
    </main>
  );
}

export default function MetricDetailPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar variant="app" />
        <Suspense fallback={<FullScreenLoader />}>
          <DetailContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
