import { RiskCategory } from '@/lib/types';
import { Dictionary } from '@/lib/i18n';

interface PdfSummaryTableProps {
  categories: RiskCategory[];
  dict: Dictionary;
  lang: 'ar' | 'en';
  categoryLabel: (id: string) => string;
}

const levelColor: Record<string, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
};

const levelText: Record<'ar' | 'en', Record<string, string>> = {
  ar: { low: 'منخفض', medium: 'متوسط', high: 'مرتفع' },
  en: { low: 'Low', medium: 'Medium', high: 'High' },
};

export function PdfSummaryTable({ categories, dict, lang, categoryLabel }: PdfSummaryTableProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-lg font-semibold text-text">{dict.analysis.reportTableTitle}</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 text-start text-text-muted">
            <th className="py-2 text-start font-medium">{dict.analysis.reportTableCategory}</th>
            <th className="py-2 text-start font-medium">{dict.analysis.reportTableScore}</th>
            <th className="py-2 text-start font-medium">{dict.analysis.reportTableLevel}</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-b border-white/5 text-text last:border-0">
              <td className="py-3">{categoryLabel(cat.id)}</td>
              <td className="py-3 font-semibold">{cat.score}%</td>
              <td className="py-3">
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    color: levelColor[cat.level],
                    backgroundColor: `${levelColor[cat.level]}22`,
                  }}
                >
                  {levelText[lang][cat.level]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
