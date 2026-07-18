'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CircleCheckBig } from 'lucide-react';
import { GapItem } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { AutoCorrectButton } from './AutoCorrectButton';

interface GapAnalysisRowProps {
  gap: GapItem;
  onAutoCorrect: (requirementId: string) => void;
  isCorrecting: boolean;
  correctedText?: string;
}

export function GapAnalysisRow({ gap, onAutoCorrect, isCorrecting, correctedText }: GapAnalysisRowProps) {
  const { dict, lang } = useLanguage();

  const requirementText = lang === 'ar' ? gap.requirementTextAr : gap.requirementTextEn;
  const gapText = lang === 'ar' ? gap.gapFoundAr : gap.gapFoundEn;

  return (
    <GlassCard className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {dict.analysis.gapRequirement}
          </span>
          <Badge level="info">{gap.requirementSource}</Badge>
        </div>
        <p className="text-sm text-text-muted">{requirementText}</p>
        <p className="mt-1 text-xs text-text-muted/70" dir="ltr">
          {gap.requirementClauseRef}
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              {dict.analysis.gapFound}
            </span>
            <Badge level={gap.severity}>{gap.severity}</Badge>
          </div>
        </div>

        <p className="text-sm text-text-muted">{gapText}</p>

        <AnimatePresence initial={false}>
          {correctedText && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-lg border border-success/20 bg-success/10 p-3">
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-success-light">
                  <CircleCheckBig size={14} className="shrink-0" />
                  {dict.analysis.suggestedFix}
                </div>
                <p className="text-sm text-text">{correctedText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-3">
          <AutoCorrectButton
            onClick={() => onAutoCorrect(gap.requirementId)}
            loading={isCorrecting}
            done={!!correctedText}
          />
        </div>
      </div>
    </GlassCard>
  );
}
