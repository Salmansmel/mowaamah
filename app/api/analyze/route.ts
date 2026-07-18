import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/extractText';
import { callGeminiAnalysis, RawGeminiAnalysis } from '@/lib/gemini';
import { REGULATORY_REQUIREMENTS } from '@/lib/regulatoryRequirements';
import { generateMockAnalysis } from '@/lib/mockAnalysis';
import { AnalysisResult, GapItem } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_EXTRACTED_CHARS = 15000;

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

Task: Compare the document against each requirement. For requirements NOT adequately addressed in the document, report a gap. Then compute:
1. overallScore (0-100): overall compliance readiness.
2. riskCategories: exactly three entries with id "regulatory", "cybersecurity", and "operational", each with a score (0-100, higher = lower risk), a level ("low"|"medium"|"high"), and a short bilingual summary (Arabic in summaryAr, English in summaryEn) of that risk category's issues found in the document.
3. gaps: an array where each item references one of the requirement ids above (requirementId) that was not adequately addressed, with a bilingual description of the gap found (gapFoundAr, gapFoundEn), a severity ("low"|"medium"|"high"), and a suggested bilingual fix clause (suggestedFixAr, suggestedFixEn) the startup could add to their document to close the gap.

Only reference requirement ids from the list above. Respond only with the structured JSON matching the provided schema.`;
}

function enrichGapsWithRequirementText(raw: RawGeminiAnalysis): GapItem[] {
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
    const raw = await callGeminiAnalysis(prompt);

    const result: AnalysisResult = {
      overallScore: raw.overallScore,
      riskCategories: raw.riskCategories,
      gaps: enrichGapsWithRequirementText(raw),
      source: 'gemini',
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error('Gemini analysis failed — falling back to mock analysis', err);
    const fallback = await generateMockAnalysis(file.name, sector);
    return NextResponse.json(fallback);
  }
}
