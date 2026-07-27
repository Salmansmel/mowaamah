import OpenAI from 'openai';

const apiKey = process.env.NVIDIA_API_KEY;

export const nvidiaClient = apiKey ? new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
}) : null;

// Use a generative model, as embedding models cannot generate JSON responses
export const NVIDIA_MODEL = 'meta/llama-3.1-8b-instruct';

export interface RawAnalysis {
  overallScore: number;
  riskCategories: {
    id: 'regulatory' | 'cybersecurity' | 'operational';
    score: number;
    level: 'low' | 'medium' | 'high';
    summaryAr: string;
    summaryEn: string;
  }[];
  gaps: {
    requirementId: string;
    gapFoundAr: string;
    gapFoundEn: string;
    severity: 'low' | 'medium' | 'high';
    suggestedFixAr?: string;
    suggestedFixEn?: string;
  }[];
}

/**
 * Attempt to repair common JSON errors from LLMs:
 * - Trailing commas before } or ]
 * - Single quotes instead of double quotes (careful with Arabic text)
 * - Unescaped newlines inside strings
 * - Truncated JSON (missing closing braces)
 */
function repairJSON(text: string): string {
  let fixed = text;

  // Remove markdown code blocks
  fixed = fixed.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  // Fix trailing commas: ,} or ,]
  fixed = fixed.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

  // Fix unescaped newlines inside JSON string values
  fixed = fixed.replace(/(?<=": ")(.*?)(?=")/gs, (match) => {
    return match.replace(/\n/g, '\\n');
  });

  // If JSON is truncated (missing closing braces), try to close it
  const openBraces = (fixed.match(/{/g) || []).length;
  const closeBraces = (fixed.match(/}/g) || []).length;
  const openBrackets = (fixed.match(/\[/g) || []).length;
  const closeBrackets = (fixed.match(/]/g) || []).length;

  // Close unclosed brackets first, then braces
  for (let i = 0; i < openBrackets - closeBrackets; i++) {
    fixed += ']';
  }
  for (let i = 0; i < openBraces - closeBraces; i++) {
    fixed += '}';
  }

  // Remove any trailing text after the last }
  const lastBrace = fixed.lastIndexOf('}');
  if (lastBrace !== -1) {
    fixed = fixed.slice(0, lastBrace + 1);
  }

  return fixed;
}

export async function callNvidiaAnalysis(prompt: string): Promise<RawAnalysis> {
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
    return JSON.parse(cleanText) as RawAnalysis;
  } catch (firstError) {
    console.error('First JSON parse failed, attempting aggressive repair...');
    
    // Aggressive repair: extract just the JSON object
    try {
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aggressive = repairJSON(jsonMatch[0]);
        return JSON.parse(aggressive) as RawAnalysis;
      }
    } catch {
      // Fall through
    }
    
    console.error('Failed to parse NVIDIA JSON response:', cleanText.slice(0, 500));
    throw new Error('NVIDIA API returned invalid JSON: ' + (firstError as Error).message);
  }
}
