export interface StartupInput {
  startup_name: string;
  tagline?: string;
  problem_statement: string;
  solution_description: string;
  target_customer: string;
  geographic_market: string;
  industry: string;
  business_model: string;
  available_budget_usd: number;
  timeframe_months: number;
  known_competitors?: string[];
  pricing_hypothesis?: string;
  additional_notes?: string;
}

export interface DimensionBreakdown {
  name: string;
  weight: number;
  raw_score: number;
  weighted_score: number;
  reasoning: string;
  strengths: string[];
  risks: string[];
}

export interface PenaltyItem {
  reason: string;
  deduction: number;
  explanation: string;
}

export interface ScoreReport {
  overall_score: number;
  grade: string;
  verdict: string;
  formula_explanation: string;
  confidence_level: string;
  dimensions: Record<string, DimensionBreakdown>;
  penalties_applied: PenaltyItem[];
}

export interface CompetitorItem {
  name: string;
  type: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  differentiator_wedge: string;
  pricing_model?: string;
}

export interface AdversarialCritique {
  investor_persona: string;
  fatal_flaws: string[];
  untested_assumptions: string[];
  distribution_hurdles: string[];
  incumbent_threat_analysis: string;
  pre_mortem_scenario: string;
  required_proof_points: string[];
}

export interface ValidationExperiment {
  id: string;
  name: string;
  hypothesis_tested: string;
  method: string;
  metric_to_track: string;
  target_threshold: string;
  estimated_cost_usd: number;
  estimated_days: number;
  priority: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  milestones: string[];
  kill_metric: string;
}

export interface EvidenceItem {
  title: string;
  url: string;
  snippet: string;
  retrieved_at: string;
  verification_status: 'VERIFIED_SOURCE' | 'DERIVED_ESTIMATE' | 'UNVERIFIED_HYPOTHESIS';
  relevance_note: string;
}

export interface AnalysisReportResponse {
  id: string;
  created_at: string;
  startup_name: string;
  tagline?: string;
  industry: string;
  target_customer: string;
  geographic_market: string;
  business_model: string;
  executive_summary: string;
  score_report: ScoreReport;
  competitors: CompetitorItem[];
  adversarial_critique: AdversarialCritique;
  evidence_sources: EvidenceItem[];
  validation_experiments: ValidationExperiment[];
  roadmap: RoadmapPhase[];
  ai_provider: string;
  is_mock: boolean;
  limitations_disclaimer: string;
}

export interface AnalysisSummaryItem {
  id: string;
  startup_name: string;
  tagline?: string;
  industry: string;
  overall_score: number;
  grade: string;
  verdict: string;
  ai_provider: string;
  is_mock: boolean;
  created_at: string;
}

export interface SystemStatusResponse {
  status: string;
  ai_provider: string;
  ai_model: string;
  search_provider: string;
  gemini_key_configured: boolean;
  tavily_key_configured: boolean;
  database_url_type: string;
  total_saved_reports: number;
}
