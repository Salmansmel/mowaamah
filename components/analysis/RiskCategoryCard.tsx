'use client';

import { ShieldAlert, Server, Settings } from 'lucide-react';
import { RiskCategory } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';

const iconMap = {
  regulatory: ShieldAlert,
  cybersecurity: Server,
  operational: Settings,
};

export function RiskCategoryCard({ category }: { category: RiskCategory }) {
  const { dict, lang } = useLanguage();
  const Icon = iconMap[category.id];

  const title =
    category.id === 'regulatory'
      ? dict.analysis.riskRegulatory
      : category.id === 'cybersecurity'
        ? dict.analysis.riskCyber
        : dict.analysis.riskOperational;

  const summary = lang === 'ar' ? category.summaryAr : category.summaryEn;

  const bar =
    category.level === 'low'
      ? { className: 'bg-success', glow: '0 0 15px rgba(16,185,129,0.7)' }
      : category.level === 'medium'
        ? { className: 'bg-warning', glow: '0 0 15px rgba(245,158,11,0.7)' }
        : { className: 'bg-danger', glow: '0 0 15px rgba(239,68,68,0.7)' };

  return (
    <GlassCard className="p-6 backdrop-blur-md transition-colors hover:border-white/20">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-light">
            <Icon size={20} />
          </div>
          <h3 className="font-semibold text-text">{title}</h3>
        </div>
        <Badge level={category.level}>{category.score}%</Badge>
      </div>

      <p className="mb-4 text-sm text-text-muted">{summary}</p>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${bar.className}`}
          style={{ width: `${category.score}%`, boxShadow: bar.glow }}
        />
      </div>
    </GlassCard>
  );
}
