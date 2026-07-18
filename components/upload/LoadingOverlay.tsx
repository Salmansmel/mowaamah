'use client';

import { AnimatePresence, motion } from 'framer-motion';

export function LoadingOverlay({ visible, message }: { visible: boolean; message: string }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-background/80 backdrop-blur-md"
        >
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-primary" />
          <p className="text-text-muted">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
