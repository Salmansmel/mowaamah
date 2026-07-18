'use client';

import { useState } from 'react';
import { GapItem } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { delay } from '@/lib/utils';
import { GapAnalysisRow } from './GapAnalysisRow';

export function GapAnalysisTable({ gaps }: { gaps: GapItem[] }) {
  const { lang } = useLanguage();
  const [correctingIds, setCorrectingIds] = useState<Set<string>>(new Set());
  const [correctedMap, setCorrectedMap] = useState<Record<string, string>>({});

  async function handleAutoCorrect(requirementId: string) {
    setCorrectingIds((prev) => new Set(prev).add(requirementId));
    await delay(1200);

    const gap = gaps.find((g) => g.requirementId === requirementId);
    const fix =
      (lang === 'ar' ? gap?.suggestedFixAr : gap?.suggestedFixEn) ||
      (lang === 'ar'
        ? 'تمت إضافة فقرة توضح الالتزام الكامل بهذا المتطلب.'
        : 'A clause has been added confirming full compliance with this requirement.');

    setCorrectedMap((prev) => ({ ...prev, [requirementId]: fix }));
    setCorrectingIds((prev) => {
      const next = new Set(prev);
      next.delete(requirementId);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {gaps.map((gap) => (
        <GapAnalysisRow
          key={gap.requirementId}
          gap={gap}
          onAutoCorrect={handleAutoCorrect}
          isCorrecting={correctingIds.has(gap.requirementId)}
          correctedText={correctedMap[gap.requirementId]}
        />
      ))}
    </div>
  );
}
