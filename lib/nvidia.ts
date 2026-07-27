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

export async function callNvidiaAnalysis(prompt: string): Promise<RawAnalysis> {
  if (!nvidiaClient) throw new Error('NVIDIA_API_KEY not configured');

  const response = await nvidiaClient.chat.completions.create({
    model: NVIDIA_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.0,
    top_p: 0.7,
    max_tokens: 2048,
    response_format: { type: 'json_object' },
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error('Empty response from NVIDIA API');
  
  // Clean markdown json blocks if the model outputs them despite instructions
  const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  try {
    return JSON.parse(cleanText) as RawAnalysis;
  } catch (parseError) {
    console.error('Failed to parse NVIDIA JSON response:', cleanText);
    throw new Error('NVIDIA API returned invalid JSON: ' + (parseError as Error).message);
  }
}
