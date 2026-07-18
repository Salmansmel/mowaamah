import { AnalysisResult, GapItem, RiskCategoryId } from './types';
import { REGULATORY_REQUIREMENTS } from './regulatoryRequirements';
import { deriveDashboardMetrics } from './dashboardMetrics';

export type MetricSlug =
  | 'overall'
  | 'governance'
  | 'data-protection'
  | 'security'
  | 'risks'
  | 'sector';

type Categories = RiskCategoryId[] | 'all';
type ValueKind = 'score' | 'indicator' | 'count' | 'sector';

interface MetricConfig {
  /** i18n key under dict.dashboard for the title */
  titleKey:
    | 'indOverall'
    | 'indGovernance'
    | 'indDataProtection'
    | 'indSecurity'
    | 'risksDetected'
    | 'sectorLabel';
  /** i18n key under dict.detail for the explanatory blurb */
  blurbKey:
    | 'blurbOverall'
    | 'blurbGovernance'
    | 'blurbDataProtection'
    | 'blurbSecurity'
    | 'blurbRisks'
    | 'blurbSector';
  categories: Categories;
  valueKind: ValueKind;
  /** which readinessIndicator feeds the displayed % when valueKind === 'indicator' */
  indicatorKey?: 'indGovernance' | 'indDataProtection' | 'indSecurity' | 'indOverall';
}

export const DETAIL_METRICS: Record<MetricSlug, MetricConfig> = {
  overall: { titleKey: 'indOverall', blurbKey: 'blurbOverall', categories: 'all', valueKind: 'score' },
  governance: {
    titleKey: 'indGovernance',
    blurbKey: 'blurbGovernance',
    categories: ['regulatory'],
    valueKind: 'indicator',
    indicatorKey: 'indGovernance',
  },
  'data-protection': {
    titleKey: 'indDataProtection',
    blurbKey: 'blurbDataProtection',
    categories: ['cybersecurity'],
    valueKind: 'indicator',
    indicatorKey: 'indDataProtection',
  },
  security: {
    titleKey: 'indSecurity',
    blurbKey: 'blurbSecurity',
    categories: ['cybersecurity', 'operational'],
    valueKind: 'indicator',
    indicatorKey: 'indSecurity',
  },
  risks: { titleKey: 'risksDetected', blurbKey: 'blurbRisks', categories: 'all', valueKind: 'count' },
  sector: { titleKey: 'sectorLabel', blurbKey: 'blurbSector', categories: 'all', valueKind: 'sector' },
};

export function isValidMetric(slug: string): slug is MetricSlug {
  return slug in DETAIL_METRICS;
}

function categoryOfGap(gap: GapItem): RiskCategoryId | undefined {
  return REGULATORY_REQUIREMENTS.find((r) => r.id === gap.requirementId)?.category;
}

export function filterGapsByCategories(gaps: GapItem[], categories: Categories): GapItem[] {
  if (categories === 'all') return gaps;
  return gaps.filter((g) => {
    const cat = categoryOfGap(g);
    return cat !== undefined && categories.includes(cat);
  });
}

export interface ResolvedMetric {
  config: MetricConfig;
  /** numeric value for score/indicator; undefined for count/sector */
  value?: number;
  gaps: GapItem[];
  contributingCategories: AnalysisResult['riskCategories'];
}

export function resolveMetric(slug: MetricSlug, result: AnalysisResult): ResolvedMetric {
  const config = DETAIL_METRICS[slug];
  const metrics = deriveDashboardMetrics(result);

  let value: number | undefined;
  if (config.valueKind === 'score') value = result.overallScore;
  else if (config.valueKind === 'indicator' && config.indicatorKey) {
    value = metrics.readinessIndicators.find((i) => i.labelKey === config.indicatorKey)?.value;
  }

  const gaps = filterGapsByCategories(result.gaps, config.categories);

  const contributingCategories =
    config.categories === 'all'
      ? result.riskCategories
      : result.riskCategories.filter((c) => (config.categories as RiskCategoryId[]).includes(c.id));

  return { config, value, gaps, contributingCategories };
}
