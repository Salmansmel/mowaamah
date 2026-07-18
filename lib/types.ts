export type RiskLevel = 'low' | 'medium' | 'high';

export type RiskCategoryId = 'regulatory' | 'cybersecurity' | 'operational';

export interface RiskCategory {
  id: RiskCategoryId;
  score: number;
  level: RiskLevel;
  summaryAr: string;
  summaryEn: string;
}

export interface RegulatoryRequirement {
  id: string;
  source: string;
  clauseRef: string;
  textAr: string;
  textEn: string;
  category: RiskCategoryId;
}

export interface GapItem {
  requirementId: string;
  requirementSource: string;
  requirementClauseRef: string;
  requirementTextAr: string;
  requirementTextEn: string;
  gapFoundAr: string;
  gapFoundEn: string;
  severity: RiskLevel;
  suggestedFixAr?: string;
  suggestedFixEn?: string;
}

export type AnalysisSource = 'gemini' | 'mock-fallback';

export interface AnalysisResult {
  id?: string;
  fileName?: string;
  fileUrl?: string;
  sector?: string;
  overallScore: number;
  riskCategories: RiskCategory[];
  gaps: GapItem[];
  source: AnalysisSource;
  createdAt?: string;
}

export interface UploadRecord extends AnalysisResult {
  id: string;
  fileName: string;
  sector: string;
  createdAt: string;
}
