import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/extractText';
import { callNvidiaAnalysis, RawAnalysis } from '@/lib/nvidia';
import { REGULATORY_REQUIREMENTS } from '@/lib/regulatoryRequirements';
import { generateMockAnalysis } from '@/lib/mockAnalysis';
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
3. If you find ANY mention or evidence of the requirement conceptually, you MUST consider it MET (do NOT report a gap).
4. ONLY report a gap if you have exhaustively searched the entire text and found absolutely zero evidence.
5. Do NOT hedge by saying "it wasn't clearly mentioned" (لم يتم ذكره بشكل واضح). If it is mentioned at all, it is NOT a gap.

Respond ONLY with a valid JSON object exactly matching this structure (do NOT wrap it in markdown backticks):
{
  "overallScore": 85,
  "riskCategories": [
    { "id": "regulatory", "score": 90, "level": "low", "summaryAr": "...", "summaryEn": "..." },
    { "id": "cybersecurity", "score": 80, "level": "medium", "summaryAr": "...", "summaryEn": "..." },
    { "id": "operational", "score": 100, "level": "low", "summaryAr": "...", "summaryEn": "..." }
  ],
  "gaps": [
    {
      "requirementId": "req_id_from_list",
      "gapFoundAr": "...",
      "gapFoundEn": "...",
      "severity": "medium",
      "suggestedFixAr": "...",
      "suggestedFixEn": "..."
    }
  ]
}

Only reference requirement ids from the list above. Do NOT include any explanations outside the JSON.`;
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
    if (!text.trim()) throw new Error('No extractable text found in document');

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
    console.error('Gemini analysis failed — falling back to mock analysis', err);
    const fallback = await generateMockAnalysis(file.name, sector);
    
    // Inject the real error into the mock data so the user can debug it on the UI
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (fallback.gaps.length > 0) {
      fallback.gaps[0].gapFoundAr = `⚠️ ERROR: ${errorMessage} (This is a fallback analysis)`;
    }
    
    return NextResponse.json(fallback);
  }
}
