'use client';

import { Suspense, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { FullScreenLoader } from '@/components/layout/FullScreenLoader';
import { RiskSimulationCard } from '@/components/analysis/RiskSimulationCard';
import { GeminiSummaryCard } from '@/components/analysis/GeminiSummaryCard';
import { ReadinessScoreCard } from '@/components/analysis/ReadinessScoreCard';
import { ReadinessIndicators } from '@/components/analysis/ReadinessIndicators';
import { GapAnalysisTable } from '@/components/analysis/GapAnalysisTable';
import { ExportReportButton } from '@/components/analysis/ExportReportButton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';
import { useAnalysisResult } from '@/hooks/useAnalysisResult';
import { useLanguage } from '@/hooks/useLanguage';
import { deriveDashboardMetrics } from '@/lib/dashboardMetrics';
import type { AnalysisResult } from '@/lib/types';

function AnalysisSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="mb-8 h-8 w-72 animate-pulse rounded bg-white/5" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="mt-6 h-40 animate-pulse rounded-2xl bg-white/5" />
    </main>
  );
}

function DashboardView({ result }: { result: AnalysisResult }) {
  const { dict } = useLanguage();
  const searchParams = useSearchParams();
  const metrics = useMemo(() => deriveDashboardMetrics(result), [result]);
  const uploadId = result.id ?? searchParams.get('uploadId') ?? undefined;
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  function revealDetails() {
    setShowDetails(true);
    requestAnimationFrame(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-success-light">
            <span className="inline-block h-2 w-2 rounded-full bg-success-light" />
            {dict.dashboard.finalReport}
          </p>
          <h1 className="text-2xl font-extrabold text-text sm:text-3xl">{dict.dashboard.title}</h1>
        </div>
        {result.source === 'mock-fallback' && (
          <Badge level="medium">{dict.analysis.degradedBadge}</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ReadinessScoreCard result={result} metrics={metrics} uploadId={uploadId} />
        <GeminiSummaryCard result={result} metrics={metrics} uploadId={uploadId} />
        <RiskSimulationCard bars={metrics.riskSimBars} onShowDetails={revealDetails} />
      </div>

      <div className="mt-6">
        <ReadinessIndicators indicators={metrics.readinessIndicators} uploadId={uploadId} />
      </div>

      {!showDetails && (
        <div className="mt-8 flex justify-center">
          <Button onClick={revealDetails} variant="secondary" glow className="gap-2">
            {dict.analysis.showDetailedReport}
            <ChevronDown size={18} />
          </Button>
        </div>
      )}

      <div ref={detailsRef} className="scroll-mt-24">
        <AnimatePresence initial={false}>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mt-10"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-text">{dict.analysis.gapTitle}</h2>
                <ExportReportButton analysis={result} />
              </div>
              <GapAnalysisTable gaps={result.gaps} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function AnalysisContent() {
  const { result, loading } = useAnalysisResult();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar variant="app" />
      {loading || !result ? <AnalysisSkeleton /> : <DashboardView result={result} />}
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<FullScreenLoader />}>
        <AnalysisContent />
      </Suspense>
    </ProtectedRoute>
  );
}
