import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/extractText';
import { callNvidiaAnalysis, RawAnalysis } from '@/lib/nvidia';
import { REGULATORY_REQUIREMENTS } from '@/lib/regulatoryRequirements';
import { AnalysisResult, GapItem } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_EXTRACTED_CHARS = 100000;

function buildAnalysisPrompt(documentText: string, sector: string): string {
  const requirementsBlock = REGULATORY_REQUIREMENTS.map(
    (r) => `- id: ${r.id} | source: ${r.source} ${r.clauseRef}\n  requirement: ${r.textEn}`
  ).join('\n');

  return `You are a Saudi Arabian financial regulatory compliance analyst reviewing a fintech startup's project document for the "${sector}" sector against SAMA (Saudi Central Bank) requirements.

Below is a fixed list of regulatory requirements, each with an id:
${requirementsBlock}

Below is the text extracted from the startup's uploaded project document:
"""
${documentText}
"""

IMPORTANT: The text above was extracted from an Arabic PDF. Text extraction sometimes scrambles spaces or word order in right-to-left languages. 

Task: You must perform a STRICT AND PRECISE RETRIEVAL search for each requirement. Do NOT rely on general summaries. For every single requirement in the list:
1. Search the extracted document for any related keywords, synonyms, or partial matches.
2. CRITICAL: Search for the meaning and context in the Arabic language (e.g., "وحدة التحريات المالية"), do NOT require an exact literal match with the English requirement text.
3. امسح النص بالكامل بحثاً عن كل متطلب على حدة. لا تصرح بغياب المتطلب إلا بعد التأكد التام من عدم وجود أي مرادفات عربية له في كامل المستند.
4. If you find ANY mention or evidence of the requirement conceptually, you MUST consider it MET (do NOT report a gap).
5. ONLY report a gap if you have exhaustively searched the entire text and found absolutely zero evidence.
6. Do NOT hedge by saying "it wasn't clearly mentioned" (لم يتم ذكره بشكل واضح). If it is mentioned at all, it is NOT a gap.

You MUST calculate the scores yourself based on your analysis. Do NOT use placeholder numbers.
- overallScore: Calculate as a percentage (0-100) reflecting how many requirements are MET vs total requirements.
- Each riskCategory score: Calculate based on how well the document addresses that specific risk area.
- level: "low" if score >= 80, "medium" if score >= 50, "high" if score < 50.

Respond ONLY with a valid JSON object exactly matching this structure (do NOT wrap it in markdown backticks):
{
  "overallScore": <YOUR_CALCULATED_SCORE>,
  "riskCategories": [
    { "id": "regulatory", "score": <CALCULATED>, "level": "<CALCULATED>", "summaryAr": "<your Arabic summary>", "summaryEn": "<your English summary>" },
    { "id": "cybersecurity", "score": <CALCULATED>, "level": "<CALCULATED>", "summaryAr": "<your Arabic summary>", "summaryEn": "<your English summary>" },
    { "id": "operational", "score": <CALCULATED>, "level": "<CALCULATED>", "summaryAr": "<your Arabic summary>", "summaryEn": "<your English summary>" }
  ],
  "gaps": [
    {
      "requirementId": "<actual_req_id_from_list>",
      "gapFoundAr": "<Arabic description of the gap>",
      "gapFoundEn": "<English description of the gap>",
      "severity": "<low|medium|high>",
      "suggestedFixAr": "<Arabic fix suggestion>",
      "suggestedFixEn": "<English fix suggestion>"
    }
  ]
}

CRITICAL RULES:
- The overallScore MUST be mathematically consistent with the gaps found. If many gaps exist, the score MUST be low.
- Do NOT copy example numbers. Calculate real scores from your analysis.
- Only reference requirement ids from the list above.
- Do NOT include any explanations outside the JSON.`;
}

function enrichGapsWithRequirementText(raw: RawAnalysis): GapItem[] {
  return raw.gaps
    .map((gap): GapItem | null => {
      const requirement = REGULATORY_REQUIREMENTS.find((r) => r.id === gap.requirementId);
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

    const prompt = buildAnalysisPrompt(text.slice(0, MAX_EXTRACTED_CHARS), sector);
    const raw = await callNvidiaAnalysis(prompt);

    const result: AnalysisResult = {
      overallScore: raw.overallScore,
      riskCategories: raw.riskCategories,
      gaps: enrichGapsWithRequirementText(raw),
      source: 'nvidia',
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error('API Error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
