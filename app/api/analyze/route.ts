import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/extractText';
import { callNvidiaAnalysis, RawAnalysis } from '@/lib/nvidia';
import { getRequirementsForSector } from '@/lib/regulatoryRequirements';
import { AnalysisResult, GapItem, RegulatoryRequirement } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_EXTRACTED_CHARS = 100000;

const SECTOR_CONTEXT: Record<string, string> = {
  'fintech-payments': `This is a DIGITAL PAYMENTS company. Focus on payment processing compliance, capital adequacy, AML/KYC, and transaction monitoring.`,
  'open-banking-aisp': `This is an OPEN BANKING (AISP) company that accesses customer bank accounts to read financial data.
CRITICAL VIOLATIONS TO LOOK FOR:
- Storing bank credentials (username/password) instead of using OAuth 2.0 — this is a CATASTROPHIC violation
- Collecting unnecessary data like GPS location, contacts, or call logs — violates data minimization
- Bundling all consents into one general Terms & Conditions — must be granular per data type
- Retaining data indefinitely/permanently — must have defined retention period
- Sharing financial data with advertisers or third parties without explicit separate consent
- Not allowing users to revoke access and delete their data`,
};

function buildAnalysisPrompt(documentText: string, sector: string, requirements: RegulatoryRequirement[]): string {
  const requirementsBlock = requirements.map(
    (r) => `- id: ${r.id} | source: ${r.source} ${r.clauseRef}\n  requirement (AR): ${r.textAr}\n  requirement (EN): ${r.textEn}`
  ).join('\n');

  const sectorContext = SECTOR_CONTEXT[sector] || SECTOR_CONTEXT['fintech-payments'];

  return `You are a Saudi Arabian financial regulatory compliance analyst. You are reviewing a startup's compliance document.

SECTOR CONTEXT:
${sectorContext}

Below is the FULL list of regulatory requirements you must check (${requirements.length} total), each with an id:
${requirementsBlock}

Below is the text extracted from the startup's uploaded document:
"""
${documentText}
"""

YOUR TASK:
For each of the ${requirements.length} requirements above, search the document carefully:
1. Search for the meaning and context in ARABIC (e.g., "رأس المال", "تشفير", "وحدة التحريات المالية"), not just English keywords.
2. امسح النص بالكامل بحثاً عن كل متطلب على حدة. لا تصرح بغياب المتطلب إلا بعد التأكد التام من عدم وجود أي مرادفات عربية له في كامل المستند.
3. If you find ANY mention or evidence of a requirement, it is MET — do NOT report it as a gap.
4. ONLY report a gap if there is ZERO evidence in the entire document.
5. ALSO look for ACTIVE VIOLATIONS: if the document describes a practice that directly CONTRADICTS a requirement (e.g., storing passwords when the requirement prohibits it), report it as a HIGH severity gap and explain the violation clearly.

SCORING RULES:
- overallScore: Calculate as (number of MET requirements / total requirements) * 100. Round to nearest integer.
- Each riskCategory score: Calculate based on how many requirements in that category are MET.
- level: "low" if score >= 80, "medium" if score >= 50, "high" if score < 50.
- If many gaps exist, the overallScore MUST be low. A document with 5+ gaps cannot score above 60%.
- If the document actively VIOLATES requirements (not just missing them), scores should be even lower.

Respond ONLY with valid JSON matching this structure (no markdown, no backticks):
{
  "overallScore": <CALCULATE_FROM_ANALYSIS>,
  "riskCategories": [
    { "id": "regulatory", "score": <CALCULATE>, "level": "<CALCULATE>", "summaryAr": "<detailed Arabic summary>", "summaryEn": "<detailed English summary>" },
    { "id": "cybersecurity", "score": <CALCULATE>, "level": "<CALCULATE>", "summaryAr": "<detailed Arabic summary>", "summaryEn": "<detailed English summary>" },
    { "id": "operational", "score": <CALCULATE>, "level": "<CALCULATE>", "summaryAr": "<detailed Arabic summary>", "summaryEn": "<detailed English summary>" }
  ],
  "gaps": [
    {
      "requirementId": "<actual_id_from_list>",
      "gapFoundAr": "<Arabic: describe exactly what is missing or violated>",
      "gapFoundEn": "<English: describe exactly what is missing or violated>",
      "severity": "<low|medium|high>",
      "suggestedFixAr": "<Arabic: specific actionable fix>",
      "suggestedFixEn": "<English: specific actionable fix>"
    }
  ]
}`;
}

function enrichGapsWithRequirementText(raw: RawAnalysis, requirements: RegulatoryRequirement[]): GapItem[] {
  return raw.gaps
    .map((gap): GapItem | null => {
      const requirement = requirements.find((r) => r.id === gap.requirementId);
      if (!requirement) return null;
      return {
        requirementId: requirement.id,
        requirementSource: requirement.source,
        requirementClauseRef: requirement.clauseRef,
        requirementTextAr: requirement.textAr,
        requirementTextEn: requirement.textEn,
        gapFoundAr: gap.gapFoundAr,
        gapFoundEn: gap.gapFoundEn,
        severity: gap.severity,
        suggestedFixAr: gap.suggestedFixAr,
        suggestedFixEn: gap.suggestedFixEn,
      };
    })
    .filter((g): g is GapItem => g !== null);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const sector = String(formData.get('sector') ?? 'fintech-payments');

  if (!file) {
    return NextResponse.json({ error: 'no file provided' }, { status: 400 });
  }

  try {
    const text = await extractTextFromFile(file);
    if (!text || text.trim().length < 50) {
      return NextResponse.json({ error: 'فشل استخراج النص، يرجى التأكد من صلاحية الملف وأن يحتوي على نصوص قابلة للقراءة.' }, { status: 400 });
    }

    console.log(`[ANALYZE] Sector: ${sector} | Text length: ${text.length} chars | First 200 chars: ${text.slice(0, 200)}`);

    const requirements = getRequirementsForSector(sector);
    const prompt = buildAnalysisPrompt(text.slice(0, MAX_EXTRACTED_CHARS), sector, requirements);
    const raw = await callNvidiaAnalysis(prompt);

    const result: AnalysisResult = {
      overallScore: raw.overallScore,
      riskCategories: raw.riskCategories,
      gaps: enrichGapsWithRequirementText(raw, requirements),
      source: 'nvidia',
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error('API Error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
