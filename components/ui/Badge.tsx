import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeLevel = 'low' | 'medium' | 'high' | 'info' | 'success';

const levelClasses: Record<BadgeLevel, string> = {
  low: 'bg-success/15 text-success-light border-success/30',
  success: 'bg-success/15 text-success-light border-success/30',
  medium: 'bg-warning/15 text-warning border-warning/30',
  high: 'bg-danger/15 text-danger border-danger/30',
  info: 'bg-primary/15 text-primary-light border-primary/30',
};

export function Badge({ level, children }: { level: BadgeLevel; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
        levelClasses[level]
      )}
    >
      {children}
    </span>
  );
}
