'use client';

import { useRef, useState } from 'react';
import { Download, LoaderCircle, CircleCheckBig } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/Button';
import { delay } from '@/lib/utils';

type ExportStatus = 'idle' | 'generating' | 'done';

const PDF_MARGIN = 24; // pt
const BLOCK_GAP = 12; // pt, vertical space between stacked blocks on the same page

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

      // Capture each card individually (instead of one giant screenshot) so we can
      // control pagination ourselves — a card is only ever placed whole on a page,
      // never split, since the slice boundary in a single-image approach has no
      // awareness of element edges.
      const blocks = Array.from(
        printRef.current.querySelectorAll<HTMLElement>('[data-pdf-block]')
      );

      const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const usableWidth = pageWidth - PDF_MARGIN * 2;

      let cursorY = PDF_MARGIN;
      let isFirstBlock = true;

      for (const block of blocks) {
        const canvas = await html2canvas(block, { backgroundColor: '#0b0f19', scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * usableWidth) / canvas.width;

        if (!isFirstBlock && cursorY + imgHeight > pageHeight - PDF_MARGIN) {
          pdf.addPage();
          cursorY = PDF_MARGIN;
        }

        pdf.addImage(imgData, 'PNG', PDF_MARGIN, cursorY, usableWidth, imgHeight);
        cursorY += imgHeight + BLOCK_GAP;
        isFirstBlock = false;
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

  const categoryLabel = (id: string) =>
    id === 'regulatory'
      ? dict.analysis.riskRegulatory
      : id === 'cybersecurity'
        ? dict.analysis.riskCyber
        : dict.analysis.riskOperational;

  const cardClass = 'rounded-2xl border border-white/10 bg-white/5 p-6';

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

      {/* Off-screen printable report captured card-by-card by html2canvas — kept in
          normal DOM flow so layout/fonts render correctly, positioned far outside
          the viewport. Fixed width mimics the live dashboard's spaciousness and
          gives a consistent aspect ratio for rasterization. */}
      <div
        ref={printRef}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="fixed left-[-9999px] top-0 w-[1024px] bg-background p-8 text-text"
        style={{ fontFamily: lang === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
      >
        <div className="grid gap-6">
          <div data-pdf-block className={cardClass}>
            <h1 className="mb-2 text-2xl font-bold">
              {dict.nav.brand} — {dict.analysis.gapTitle}
            </h1>
            {analysis.fileName && (
              <p className="mb-4 text-sm text-text-muted">{analysis.fileName}</p>
            )}
            <p className="text-sm text-text-muted">{dict.analysis.scoreLabel}</p>
            <p className="text-4xl font-extrabold">{analysis.overallScore}%</p>
          </div>

          <div data-pdf-block>
            <h2 className="text-lg font-semibold">{dict.analysis.riskTitle}</h2>
          </div>
          {analysis.riskCategories.map((cat) => (
            <div
              key={cat.id}
              data-pdf-block
              className={`${cardClass} flex items-center justify-between`}
            >
              <span>{categoryLabel(cat.id)}</span>
              <span className="text-lg font-semibold">{cat.score}%</span>
            </div>
          ))}

          <div data-pdf-block>
            <h2 className="text-lg font-semibold">{dict.analysis.gapTitle}</h2>
          </div>
          {analysis.gaps.map((gap) => (
            <div key={gap.requirementId} data-pdf-block className={`${cardClass} grid gap-3`}>
              <div>
                <p className="text-xs font-semibold uppercase text-text-muted">
                  {requirementLabel} — {gap.requirementSource}
                </p>
                <p className="text-sm text-text-muted">
                  {lang === 'ar' ? gap.requirementTextAr : gap.requirementTextEn}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-text-muted">{gapLabel}</p>
                <p className="text-sm">{lang === 'ar' ? gap.gapFoundAr : gap.gapFoundEn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
