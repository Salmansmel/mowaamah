import { REGULATORY_REQUIREMENTS } from './regulatoryRequirements';
import { AnalysisResult, GapItem, RiskCategory, RiskLevel } from './types';

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function levelFromScore(score: number): RiskLevel {
  if (score >= 80) return 'low';
  if (score >= 50) return 'medium';
  return 'high';
}

/**
 * Dev/degraded-mode fallback only — invoked from app/api/analyze/route.ts
 * when the real Gemini call fails (missing key, quota, malformed response).
 */
export async function generateMockAnalysis(fileName: string, sector: string): Promise<AnalysisResult> {
  const seed = hashString(fileName + sector);
  const overallScore = 55 + (seed % 40); // 55–94

  const riskCategories: RiskCategory[] = (['regulatory', 'cybersecurity', 'operational'] as const).map(
    (id, idx) => {
      const score = 50 + ((seed >> idx) % 45);
      return {
        id,
        score,
        level: levelFromScore(score),
        summaryAr:
          id === 'regulatory'
            ? 'يوجد بعض النواقص في التوثيق التنظيمي مقارنة بمتطلبات ساما.'
            : id === 'cybersecurity'
              ? 'تحتاج ضوابط الأمن السيبراني إلى تعزيز إضافي.'
              : 'الإجراءات التشغيلية تحتاج إلى مزيد من التوثيق.',
        summaryEn:
          id === 'regulatory'
            ? 'Some gaps exist in regulatory documentation relative to SAMA requirements.'
            : id === 'cybersecurity'
              ? 'Cybersecurity controls need further strengthening.'
              : 'Operational procedures require more thorough documentation.',
      };
    }
  );

  const gapCount = 4 + (seed % 4);
  const gaps: GapItem[] = REGULATORY_REQUIREMENTS.slice(0, gapCount).map((req, idx) => ({
    requirementId: req.id,
    requirementSource: req.source,
    requirementClauseRef: req.clauseRef,
    requirementTextAr: req.textAr,
    requirementTextEn: req.textEn,
    gapFoundAr: `لم يتم العثور على ما يثبت الالتزام الكامل بهذا المتطلب في المستند المرفوع (${req.clauseRef}).`,
    gapFoundEn: `No evidence of full compliance with this requirement was found in the uploaded document (${req.clauseRef}).`,
    severity: levelFromScore(50 + ((seed >> idx) % 45)),
    suggestedFixAr: `يوصى بإضافة فقرة صريحة تتناول: ${req.textAr}`,
    suggestedFixEn: `Recommend adding an explicit clause addressing: ${req.textEn}`,
  }));

  return {
    overallScore,
    riskCategories,
    gaps,
    source: 'mock-fallback',
  };
}
