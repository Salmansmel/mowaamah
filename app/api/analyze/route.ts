import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/extractText';
import { callNvidiaAnalysis, StructuredAnalysis } from '@/lib/nvidia';
import { getRequirementsForSector } from '@/lib/regulatoryRequirements';
import { AnalysisResult, GapItem, RiskCategory, RegulatoryRequirement } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_EXTRACTED_CHARS = 100000;

const SECTOR_CONTEXT: Record<string, string> = {
  'fintech-payments': `This is a DIGITAL PAYMENTS company. Focus on payment processing compliance, capital adequacy, AML/KYC, and transaction monitoring.`,
  'open-banking-aisp': `This is an OPEN BANKING (AISP) company that accesses customer bank accounts to read financial data.
CRITICAL VIOLATIONS TO LOOK FOR:
- Storing bank credentials (username/password) instead of using OAuth 2.0 — CATASTROPHIC violation
- Collecting unnecessary data like GPS location, contacts, or call logs — violates data minimization
- Bundling all consents into one general Terms & Conditions — must be granular per data type
- Retaining data indefinitely/permanently — must have defined retention period
- Sharing financial data with advertisers or third parties without explicit separate consent
- Not allowing users to revoke access and delete their data`,
};

function buildAnalysisPrompt(documentText: string, sector: string, requirements: RegulatoryRequirement[]): string {
  const requirementsList = requirements.map(
    (r) => `- id: "${r.id}" | ${r.source} ${r.clauseRef}\n  AR: ${r.textAr}\n  EN: ${r.textEn}`
  ).join('\n');

  const sectorContext = SECTOR_CONTEXT[sector] || SECTOR_CONTEXT['fintech-payments'];

  return `You are a Saudi regulatory compliance analyst. Evaluate the document below against ${requirements.length} requirements.

SECTOR: ${sectorContext}

REQUIREMENTS LIST (${requirements.length} total):
${requirementsList}

DOCUMENT TEXT:
"""
${documentText}
"""

INSTRUCTIONS — CHAIN OF THOUGHT:
For EACH requirement in the list above, you MUST follow these 3 steps IN ORDER:

Step 1 — QUOTE: Search the entire document for text related to this requirement or its Arabic synonyms. Copy the exact Arabic text you found. If nothing found, write "غير موجود في المستند".
Step 2 — COMPLIANCE: Based on your quote, does it satisfy the requirement? Does it comply or violate it?
Step 3 — GAP: Write the gap ONLY if the quote is missing OR the text actively violates the requirement.

OUTPUT FORMAT — You MUST output valid JSON with this EXACT structure:
{
  "requirements": [
    {
      "requirementId": "<id from list>",
      "extractedQuote": "<Step 1: exact Arabic text from document, or 'غير موجود في المستند'>",
      "isCompliant": <Step 2: true or false>,
      "gap": "<Step 3: Arabic gap description if not compliant, or 'مستوفى' if compliant>",
      "gapEn": "<English gap description if not compliant, or 'Compliant' if compliant>",
      "severity": "<none if compliant, low/medium/high if gap>",
      "suggestedFix": "<Arabic fix if gap, or empty>",
      "suggestedFixEn": "<English fix if gap, or empty>"
    }
  ],
  "summaryAr": "<overall Arabic summary of document compliance>",
  "summaryEn": "<overall English summary of document compliance>"
}

CRITICAL RULES:
- You MUST include ALL ${requirements.length} requirements in the "requirements" array — both compliant and non-compliant ones.
- The "extractedQuote" field MUST be filled FIRST before deciding "isCompliant".
- If the document VIOLATES a requirement (e.g., stores passwords when prohibited), set severity to "high".
- Output ONLY the JSON object. No markdown, no backticks, no explanations outside JSON.`;
}

/**
 * Convert the structured per-requirement analysis into the AnalysisResult format
 * Scores are calculated server-side from isCompliant flags — NOT from the model
 */
function convertToAnalysisResult(
  structured: StructuredAnalysis,
  requirements: RegulatoryRequirement[]
): AnalysisResult {
  // Build a map of evaluations by requirementId
  const evalMap = new Map(structured.requirements.map(r => [r.requirementId, r]));

  // Calculate per-category scores
  const categories: Record<string, { met: number; total: number }> = {
    regulatory: { met: 0, total: 0 },
    cybersecurity: { met: 0, total: 0 },
    operational: { met: 0, total: 0 },
  };

  for (const req of requirements) {
    const cat = categories[req.category];
    if (!cat) continue;
    cat.total++;
    const evaluation = evalMap.get(req.id);
    if (evaluation?.isCompliant) {
      cat.met++;
    }
  }

  function scoreToLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= 80) return 'low';
    if (score >= 50) return 'medium';
    return 'high';
  }

  const riskCategories: RiskCategory[] = [
    {
      id: 'regulatory',
      score: categories.regulatory.total > 0
        ? Math.round((categories.regulatory.met / categories.regulatory.total) * 100)
        : 0,
      level: 'low',
      summaryAr: structured.summaryAr || '',
      summaryEn: structured.summaryEn || '',
    },
    {
      id: 'cybersecurity',
      score: categories.cybersecurity.total > 0
        ? Math.round((categories.cybersecurity.met / categories.cybersecurity.total) * 100)
        : 0,
      level: 'low',
      summaryAr: structured.summaryAr || '',
      summaryEn: structured.summaryEn || '',
    },
    {
      id: 'operational',
      score: categories.operational.total > 0
        ? Math.round((categories.operational.met / categories.operational.total) * 100)
        : 0,
      level: 'low',
      summaryAr: structured.summaryAr || '',
      summaryEn: structured.summaryEn || '',
    },
  ];

  // Set levels from scores
  for (const rc of riskCategories) {
    rc.level = scoreToLevel(rc.score);
  }

  // Calculate overall score
  const totalMet = Object.values(categories).reduce((sum, c) => sum + c.met, 0);
  const totalReqs = Object.values(categories).reduce((sum, c) => sum + c.total, 0);
  const overallScore = totalReqs > 0 ? Math.round((totalMet / totalReqs) * 100) : 0;

  // Build gaps from non-compliant requirements
  const gaps: GapItem[] = [];
  for (const evaluation of structured.requirements) {
    if (evaluation.isCompliant) continue;

    const req = requirements.find(r => r.id === evaluation.requirementId);
    if (!req) continue;

    gaps.push({
      requirementId: req.id,
      requirementSource: req.source,
      requirementClauseRef: req.clauseRef,
      requirementTextAr: req.textAr,
      requirementTextEn: req.textEn,
      gapFoundAr: evaluation.gap || 'فجوة مكتشفة',
      gapFoundEn: evaluation.gapEn || 'Gap detected',
      severity: evaluation.severity === 'none' ? 'low' : (evaluation.severity || 'medium'),
      suggestedFixAr: evaluation.suggestedFix,
      suggestedFixEn: evaluation.suggestedFixEn,
    });
  }

  return {
    overallScore,
    riskCategories,
    gaps,
    source: 'nvidia',
  };
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
      return NextResponse.json({
        error: 'فشل استخراج النص، يرجى التأكد من صلاحية الملف وأن يحتوي على نصوص قابلة للقراءة.',
      }, { status: 400 });
    }

    console.log(`[ANALYZE] Sector: ${sector} | Text length: ${text.length} chars | First 200 chars: ${text.slice(0, 200)}`);

    const requirements = getRequirementsForSector(sector);
    const prompt = buildAnalysisPrompt(text.slice(0, MAX_EXTRACTED_CHARS), sector, requirements);
    const structured = await callNvidiaAnalysis(prompt);

    console.log(`[ANALYZE] Model returned ${structured.requirements?.length || 0} requirement evaluations`);

    // Log each evaluation for debugging
    for (const r of (structured.requirements || [])) {
      console.log(`  [${r.requirementId}] compliant=${r.isCompliant} | quote="${(r.extractedQuote || '').slice(0, 80)}..." | severity=${r.severity}`);
    }

    const result = convertToAnalysisResult(structured, requirements);

    console.log(`[ANALYZE] Final score: ${result.overallScore}% | Gaps: ${result.gaps.length}`);

    return NextResponse.json(result);
  } catch (err) {
    console.error('API Error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
