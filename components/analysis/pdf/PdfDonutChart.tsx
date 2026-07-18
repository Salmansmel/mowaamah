import { ReadinessIndicator } from '@/lib/dashboardMetrics';
import { Dictionary } from '@/lib/i18n';

interface PdfDonutChartProps {
  indicators: ReadinessIndicator[];
  dict: Dictionary;
  size?: number;
}

export function PdfDonutChart({ indicators, dict, size = 180 }: PdfDonutChartProps) {
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = indicators.reduce((sum, ind) => sum + ind.value, 0) || 1;

  let cumulative = 0;
  const segments = indicators.map((ind) => {
    const fraction = ind.value / total;
    const dasharray = `${fraction * circumference} ${circumference - fraction * circumference}`;
    const dashoffset = -cumulative * circumference;
    cumulative += fraction;
    return { ...ind, dasharray, dashoffset, percent: Math.round(fraction * 100) };
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-5 text-lg font-semibold text-text">{dict.analysis.reportDonutChartTitle}</h2>
      <div className="flex flex-wrap items-center gap-8">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            {segments.map((seg) => (
              <circle
                key={seg.labelKey}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={seg.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={seg.dasharray}
                strokeDashoffset={seg.dashoffset}
              />
            ))}
          </svg>
        </div>
        <div className="flex flex-1 flex-col gap-2.5">
          {segments.map((seg) => (
            <div key={seg.labelKey} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-text-muted">{dict.dashboard[seg.labelKey]}</span>
              </div>
              <span className="font-semibold text-text">{seg.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
