from typing import List, Optional
from pydantic import BaseModel, Field
from app.core.scoring import ScoreReport


class StartupInput(BaseModel):
    startup_name: str = Field(..., min_length=2, max_length=100, json_schema_extra={"example": "EcoLogix"})
    tagline: Optional[str] = Field(None, max_length=250, json_schema_extra={"example": "Automated carbon accounting for mid-market logistics"})
    problem_statement: str = Field(..., min_length=20, max_length=2000, json_schema_extra={"example": "Mid-size freight fleets face pending CSRD and Scope 3 compliance fines but cannot afford enterprise consultancies costing $50k+."})
    solution_description: str = Field(..., min_length=20, max_length=2000, json_schema_extra={"example": "A lightweight API & telematics plugin that converts GPS and fuel telemetry into audit-ready Scope 1 & 3 carbon reports in under 5 minutes."})
    target_customer: str = Field(..., min_length=5, max_length=200, json_schema_extra={"example": "Fleet managers and operations directors at mid-size trucking companies (50-500 vehicles) in the EU."})
    geographic_market: str = Field(..., min_length=2, max_length=100, json_schema_extra={"example": "European Union (Germany, Netherlands, France)"})
    industry: str = Field(..., min_length=2, max_length=100, json_schema_extra={"example": "ClimateTech / Supply Chain Logistics"})
    business_model: str = Field(..., min_length=3, max_length=100, json_schema_extra={"example": "B2B SaaS subscription tiered by active fleet size ($15/vehicle/month)"})
    available_budget_usd: float = Field(default=10000.0, ge=0, json_schema_extra={"example": 15000.0})
    timeframe_months: int = Field(default=6, ge=1, le=36, json_schema_extra={"example": 6})
    known_competitors: Optional[List[str]] = Field(default=[], json_schema_extra={"example": ["Watershed", "Sweep", "Manual Excel Spreadsheets"]})
    pricing_hypothesis: Optional[str] = Field(None, json_schema_extra={"example": "$15 to $25 per truck per month with a $2,500 annual platform fee."})
    additional_notes: Optional[str] = Field(None, json_schema_extra={"example": "Already spoke with 4 fleet directors who confirmed manual reporting takes 20 hours per month."})


class EvidenceItem(BaseModel):
    title: str
    url: str
    snippet: str
    retrieved_at: str
    verification_status: str  # "VERIFIED_SOURCE", "DERIVED_ESTIMATE", "UNVERIFIED_HYPOTHESIS"
    relevance_note: str


class CompetitorItem(BaseModel):
    name: str
    type: str  # "Direct Competitor", "Indirect / Enterprise", "Alternative Solution"
    description: str
    strengths: List[str]
    weaknesses: List[str]
    differentiator_wedge: str
    pricing_model: Optional[str] = None


class AdversarialCritique(BaseModel):
    investor_persona: str = "Pragmatic Seed/Series-A General Partner"
    fatal_flaws: List[str]
    untested_assumptions: List[str]
    distribution_hurdles: List[str]
    incumbent_threat_analysis: str
    pre_mortem_scenario: str
    required_proof_points: List[str]


class ValidationExperiment(BaseModel):
    id: str
    name: str
    hypothesis_tested: str
    method: str
    metric_to_track: str
    target_threshold: str
    estimated_cost_usd: float
    estimated_days: int
    priority: str  # "Critical (Do First)", "High", "Medium"


class RoadmapPhase(BaseModel):
    phase: str
    title: str
    milestones: List[str]
    kill_metric: str


class AnalysisReportResponse(BaseModel):
    id: str
    created_at: str
    startup_name: str
    tagline: Optional[str] = None
    industry: str
    target_customer: str
    geographic_market: str
    business_model: str
    executive_summary: str
    score_report: ScoreReport
    competitors: List[CompetitorItem]
    adversarial_critique: AdversarialCritique
    evidence_sources: List[EvidenceItem]
    validation_experiments: List[ValidationExperiment]
    roadmap: List[RoadmapPhase]
    ai_provider: str
    is_mock: bool
    limitations_disclaimer: str


class AnalysisSummaryItem(BaseModel):
    id: str
    startup_name: str
    tagline: Optional[str] = None
    industry: str
    overall_score: float
    grade: str
    verdict: str
    ai_provider: str
    is_mock: bool
    created_at: str


class SystemStatusResponse(BaseModel):
    status: str
    ai_provider: str
    ai_model: str
    search_provider: str
    gemini_key_configured: bool
    tavily_key_configured: bool
    database_url_type: str
    total_saved_reports: int
