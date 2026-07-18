import { ReadinessIndicator } from '@/lib/dashboardMetrics';
import { Dictionary } from '@/lib/i18n';

interface PdfBarChartProps {
  indicators: ReadinessIndicator[];
  dict: Dictionary;
}

export function PdfBarChart({ indicators, dict }: PdfBarChartProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-5 text-lg font-semibold text-text">{dict.analysis.reportBarChartTitle}</h2>
      <div className="flex flex-col gap-4">
        {indicators.map((ind) => (
          <div key={ind.labelKey}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-text-muted">{dict.dashboard[ind.labelKey]}</span>
              <span className="font-semibold text-text">{ind.value}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${ind.value}%`, backgroundColor: ind.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
