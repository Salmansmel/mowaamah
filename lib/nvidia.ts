import OpenAI from 'openai';

const apiKey = process.env.NVIDIA_API_KEY;

export const nvidiaClient = apiKey ? new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
}) : null;

export const NVIDIA_MODEL = 'meta/llama-3.1-8b-instruct';

/** Per-requirement evaluation from the model */
export interface RequirementEvaluation {
  requirementId: string;
  extractedQuote: string;   // النص الحرفي من المستند — يُكتب أولاً لإجبار النموذج على البحث
  isCompliant: boolean;     // هل المتطلب مستوفى؟ — يُكتب ثانياً بعد رؤية الاقتباس
  gap: string;              // وصف الفجوة — يُكتب أخيراً بعد التفكير
  gapEn: string;
  severity: 'low' | 'medium' | 'high' | 'none';
  suggestedFix: string;
  suggestedFixEn: string;
}

/** Full structured response from the model */
export interface StructuredAnalysis {
  requirements: RequirementEvaluation[];
  summaryAr: string;
  summaryEn: string;
}

/**
 * Attempt to repair common JSON errors from LLMs
 */
function repairJSON(text: string): string {
  let fixed = text;
  fixed = fixed.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  fixed = fixed.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

  // Close unclosed brackets/braces
  const openBraces = (fixed.match(/{/g) || []).length;
  const closeBraces = (fixed.match(/}/g) || []).length;
  const openBrackets = (fixed.match(/\[/g) || []).length;
  const closeBrackets = (fixed.match(/]/g) || []).length;
  for (let i = 0; i < openBrackets - closeBrackets; i++) fixed += ']';
  for (let i = 0; i < openBraces - closeBraces; i++) fixed += '}';

  // Remove trailing text after last }
  const lastBrace = fixed.lastIndexOf('}');
  if (lastBrace !== -1) fixed = fixed.slice(0, lastBrace + 1);

  return fixed;
}

export async function callNvidiaAnalysis(prompt: string): Promise<StructuredAnalysis> {
  if (!nvidiaClient) throw new Error('NVIDIA_API_KEY not configured');

  const response = await nvidiaClient.chat.completions.create({
    model: NVIDIA_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.0,
    top_p: 0.7,
    max_tokens: 4096,
    response_format: { type: 'json_object' },
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error('Empty response from NVIDIA API');
  
  const cleanText = repairJSON(text);
  
  try {
    return JSON.parse(cleanText) as StructuredAnalysis;
  } catch (firstError) {
    console.error('First JSON parse failed, attempting aggressive repair...');
    try {
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(repairJSON(jsonMatch[0])) as StructuredAnalysis;
      }
    } catch { /* fall through */ }
    
    console.error('Failed to parse NVIDIA JSON:', cleanText.slice(0, 500));
    throw new Error('NVIDIA API returned invalid JSON: ' + (firstError as Error).message);
  }
}
