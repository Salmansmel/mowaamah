'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, CircleCheckBig, LoaderCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface AutoCorrectButtonProps {
  onClick: () => void;
  loading: boolean;
  done: boolean;
}

export function AutoCorrectButton({ onClick, loading, done }: AutoCorrectButtonProps) {
  const { dict } = useLanguage();

  return (
    <button
      onClick={onClick}
      disabled={loading || done}
      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${
        done
          ? 'border-success/30 bg-success/10 text-success-light'
          : 'border-primary/30 bg-primary/10 text-primary-light hover:bg-primary/20'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.span key="done" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CircleCheckBig size={15} />
            {dict.analysis.autoCorrected}
          </motion.span>
        ) : loading ? (
          <motion.span key="loading" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoaderCircle size={15} className="animate-spin" />
            {dict.analysis.autoCorrecting}
          </motion.span>
        ) : (
          <motion.span key="idle" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Sparkles size={15} />
            {dict.analysis.autoCorrect}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
