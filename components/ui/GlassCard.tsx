import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('glass rounded-2xl', className)}>{children}</div>;
}
