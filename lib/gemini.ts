import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY; // server-only, never NEXT_PUBLIC_

export const geminiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Free-tier eligible, supports structured JSON output. Using the "latest" alias
// (rather than pinning e.g. 'gemini-2.5-flash') so this keeps working as Google
// rolls out newer model versions and retires older ones for new API keys.
// If free-tier rate limits are hit during a demo, swap to 'gemini-flash-lite-latest'
// (cheaper/higher-throughput, slightly lower reasoning quality).
export const GEMINI_MODEL = 'gemini-flash-latest';

export const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
    riskCategories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, enum: ['regulatory', 'cybersecurity', 'operational'] },
          score: { type: Type.NUMBER },
          level: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
          summaryAr: { type: Type.STRING },
          summaryEn: { type: Type.STRING },
        },
        required: ['id', 'score', 'level', 'summaryAr', 'summaryEn'],
      },
    },
    gaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          requirementId: { type: Type.STRING },
          gapFoundAr: { type: Type.STRING },
          gapFoundEn: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
          suggestedFixAr: { type: Type.STRING },
          suggestedFixEn: { type: Type.STRING },
        },
        required: ['requirementId', 'gapFoundAr', 'gapFoundEn', 'severity'],
      },
    },
  },
  required: ['overallScore', 'riskCategories', 'gaps'],
};

export interface RawGeminiAnalysis {
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

export async function callGeminiAnalysis(prompt: string): Promise<RawGeminiAnalysis> {
  if (!geminiClient) throw new Error('GEMINI_API_KEY not configured');

  const response = await geminiClient.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: analysisResponseSchema,
      // Extended "thinking" adds meaningful latency/cost for this structured-extraction
      // task without improving output quality here — disable it for a snappier demo.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const text = response.text;
  if (!text) throw new Error('Empty response from Gemini');
  return JSON.parse(text) as RawGeminiAnalysis;
}
