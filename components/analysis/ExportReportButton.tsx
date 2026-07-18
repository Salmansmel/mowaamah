'use client';

import { useRef, useState } from 'react';
import { Download, LoaderCircle, CircleCheckBig } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/Button';
import { delay } from '@/lib/utils';

type ExportStatus = 'idle' | 'generating' | 'done';

export function ExportReportButton({ analysis }: { analysis: AnalysisResult }) {
  const { dict, lang } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<ExportStatus>('idle');

  async function handleExport() {
    if (!printRef.current) return;
    setStatus('generating');
    await delay(600); // let the generating state render before the (blocking) capture work

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas-pro'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(printRef.current, {
        backgroundColor: '#0b0f19',
        scale: 2,
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('mowaamah-compliance-report.pdf');
      setStatus('done');
      await delay(1500);
      setStatus('idle');
    } catch (err) {
      console.error('PDF export failed', err);
      setStatus('idle');
    }
  }

  const requirementLabel = lang === 'ar' ? 'المتطلب' : 'Requirement';
  const gapLabel = lang === 'ar' ? 'الفجوة' : 'Gap';

  return (
    <>
      <Button onClick={handleExport} disabled={status !== 'idle'} variant="secondary" className="gap-2">
        {status === 'generating' ? (
          <>
            <LoaderCircle size={16} className="animate-spin" />
            {dict.analysis.exporting}
          </>
        ) : status === 'done' ? (
          <>
            <CircleCheckBig size={16} className="text-success-light" />
            {dict.analysis.exported}
          </>
        ) : (
          <>
            <Download size={16} />
            {dict.analysis.exportReport}
          </>
        )}
      </Button>

      {/* Off-screen printable report captured by html2canvas — kept in normal DOM flow so layout/fonts render correctly, positioned far outside the viewport. */}
      <div
        ref={printRef}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="fixed left-[-9999px] top-0 w-[800px] bg-background p-10 text-text"
        style={{ fontFamily: lang === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
      >
        <h1 className="mb-2 text-2xl font-bold">{dict.nav.brand} — {dict.analysis.gapTitle}</h1>
        {analysis.fileName && <p className="mb-6 text-sm text-text-muted">{analysis.fileName}</p>}

        <h2 className="mb-1 text-lg font-semibold">{dict.analysis.scoreLabel}</h2>
        <p className="mb-6 text-3xl font-extrabold">{analysis.overallScore}%</p>

        <h2 className="mb-3 text-lg font-semibold">{dict.analysis.riskTitle}</h2>
        <div className="mb-6 flex flex-col gap-2">
          {analysis.riskCategories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between border-b border-white/10 pb-2">
              <span>
                {cat.id === 'regulatory'
                  ? dict.analysis.riskRegulatory
                  : cat.id === 'cybersecurity'
                    ? dict.analysis.riskCyber
                    : dict.analysis.riskOperational}
              </span>
              <span className="font-semibold">{cat.score}%</span>
            </div>
          ))}
        </div>

        <h2 className="mb-3 text-lg font-semibold">{dict.analysis.gapTitle}</h2>
        <div className="flex flex-col gap-4">
          {analysis.gaps.map((gap) => (
            <div key={gap.requirementId} className="border-b border-white/10 pb-3">
              <p className="text-xs font-semibold uppercase text-text-muted">
                {requirementLabel} — {gap.requirementSource}
              </p>
              <p className="mb-2 text-sm text-text-muted">
                {lang === 'ar' ? gap.requirementTextAr : gap.requirementTextEn}
              </p>
              <p className="text-xs font-semibold uppercase text-text-muted">{gapLabel}</p>
              <p className="text-sm">{lang === 'ar' ? gap.gapFoundAr : gap.gapFoundEn}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
