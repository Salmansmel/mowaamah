import { AnalysisResult, RiskCategoryId } from './types';

export type ReadinessLevel = 'high' | 'medium' | 'low';
export type PerformanceLevel = 'excellent' | 'moderate' | 'weak';

export interface ReadinessIndicator {
  /** i18n key under dict.dashboard for the label */
  labelKey: 'indGovernance' | 'indDataProtection' | 'indSecurity' | 'indOverall';
  value: number;
  color: string;
}

export interface RiskSimBar {
  label: string; // fixed latin abbreviation (RSK/GAP/GOV/SCR)
  value: number; // 0-100 bar height
  color: string;
}

export interface DashboardMetrics {
  readinessIndicators: ReadinessIndicator[];
  riskSimBars: RiskSimBar[];
  readiness: ReadinessLevel;
  performance: PerformanceLevel;
  gapCount: number;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function scoreById(result: AnalysisResult, id: RiskCategoryId): number {
  return result.riskCategories.find((c) => c.id === id)?.score ?? 0;
}

export function deriveDashboardMetrics(result: AnalysisResult): DashboardMetrics {
  const reg = scoreById(result, 'regulatory');
  const cyber = scoreById(result, 'cybersecurity');
  const ops = scoreById(result, 'operational');
  const overall = result.overallScore;
  const gapCount = result.gaps.length;

  const readiness: ReadinessLevel = overall >= 71 ? 'high' : overall >= 41 ? 'medium' : 'low';
  const performance: PerformanceLevel =
    overall >= 71 ? 'excellent' : overall >= 41 ? 'moderate' : 'weak';

  const readinessIndicators: ReadinessIndicator[] = [
    { labelKey: 'indGovernance', value: Math.round(reg), color: '#10b981' },
    { labelKey: 'indDataProtection', value: Math.round(cyber * 0.6 + reg * 0.4), color: '#a855f7' },
    { labelKey: 'indSecurity', value: Math.round(cyber * 0.5 + ops * 0.5), color: '#3b82f6' },
    { labelKey: 'indOverall', value: Math.round(overall), color: '#10b981' },
  ];

  const riskSimBars: RiskSimBar[] = [
    { label: 'RSK', value: clamp(100 - overall, 5, 100), color: '#ef4444' },
    { label: 'GAP', value: clamp(gapCount * 12, 8, 100), color: '#a16207' },
    { label: 'GOV', value: clamp(reg, 5, 100), color: '#3b82f6' },
    { label: 'SCR', value: clamp(overall, 5, 100), color: '#10b981' },
  ];

  return { readinessIndicators, riskSimBars, readiness, performance, gapCount };
}
