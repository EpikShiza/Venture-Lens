import logging
import uuid
from datetime import datetime, timezone
from typing import List

from app.core.config import settings
from app.core.scoring import compute_evaluation_score
from app.schemas.analysis import (
    StartupInput,
    AnalysisReportResponse,
    EvidenceItem,
    CompetitorItem,
    AdversarialCritique,
    ValidationExperiment,
    RoadmapPhase,
)
from app.services.ai_provider import get_ai_provider, MockAIProvider
from app.services.search_provider import get_search_provider

logger = logging.getLogger(__name__)

LIMITATIONS_DISCLAIMER = (
    "NOTICE: VentureLens feasibility scores and evaluations are algorithmic estimates based on defined criteria "
    "and available web evidence. They do NOT constitute financial, legal, or investment advice, nor do they "
    "guarantee commercial success or venture funding. Unverified claims reflect founder hypotheses."
)


class EvaluationOrchestrator:
    """
    Orchestrates the 5-stage VentureLens startup evaluation workflow:
    1. Structure & Parameter Normalization
    2. Real Evidence & Competitor Discovery (Web Search)
    3. Criterion Scoring & Dimensional Decomposition
    4. Adversarial Red-Team Diligence (Stress-Testing)
    5. Evidence Reconciliation & Final Report Generation
    """

    def __init__(self):
        self.search_provider = get_search_provider()
        self.ai_provider = get_ai_provider()

    async def run_evaluation(self, startup: StartupInput) -> AnalysisReportResponse:
        report_id = str(uuid.uuid4())
        created_at_str = datetime.now(timezone.utc).isoformat()

        # STAGE 1 & 2: Search Query Construction and Evidence Discovery
        search_query = f"{startup.industry} {startup.target_customer} competitor solutions market"
        logger.info(f"Initiating evidence retrieval for query: {search_query}")
        
        evidence_items: List[EvidenceItem] = []
        try:
            evidence_items = await self.search_provider.search(search_query, max_results=4)
        except Exception as ex:
            logger.warning(f"Search provider failed ({ex}), falling back to empty evidence.")
            evidence_items = []

        # STAGE 3 & 4: AI Diligence & Adversarial Critique
        is_mock_mode = isinstance(self.ai_provider, MockAIProvider) or settings.AI_PROVIDER == "mock"
        provider_name = "mock" if is_mock_mode else settings.AI_PROVIDER

        # Execute evaluation via configured AI provider (no silent fallback to mock on real provider error)
        raw_evaluation = await self.ai_provider.generate_evaluation(startup, evidence_items)

        # STAGE 5: Scoring Calculation & Reconciliation
        raw_scores = raw_evaluation.get("raw_scores", {
            "problem_clarity": 70.0,
            "market_opportunity": 65.0,
            "competitive_defensibility": 60.0,
            "business_viability": 65.0,
            "technical_feasibility": 75.0,
        })
        dimension_meta = raw_evaluation.get("dimension_meta", {})
        penalties = raw_evaluation.get("penalties", [])

        # Deterministic formula-driven score computation
        score_report = compute_evaluation_score(
            raw_scores=raw_scores,
            reasoning_map=dimension_meta,
            penalties=penalties,
            evidence_count=len(evidence_items),
        )

        # Parse competitors
        raw_comps = raw_evaluation.get("competitors", [])
        competitors = [
            CompetitorItem(
                name=c.get("name", "Unknown Competitor"),
                type=c.get("type", "Direct Competitor"),
                description=c.get("description", "Alternative solution in space"),
                strengths=c.get("strengths", ["Established brand"]),
                weaknesses=c.get("weaknesses", ["High cost"]),
                differentiator_wedge=c.get("differentiator_wedge", "Focus on specific underserved niche"),
                pricing_model=c.get("pricing_model"),
            )
            for c in raw_comps
        ]

        # Parse adversarial critique
        raw_adv = raw_evaluation.get("adversarial_critique", {})
        adversarial_critique = AdversarialCritique(
            investor_persona=raw_adv.get("investor_persona", "Pragmatic Series-A General Partner"),
            fatal_flaws=raw_adv.get("fatal_flaws", ["Unclear willingness to pay at scale."]),
            untested_assumptions=raw_adv.get("untested_assumptions", ["Customer acquisition channels will convert profitably."]),
            distribution_hurdles=raw_adv.get("distribution_hurdles", ["Lengthy sales cycles and lack of channel partnerships."]),
            incumbent_threat_analysis=raw_adv.get("incumbent_threat_analysis", "Incumbents can bundle this feature into existing contract suites."),
            pre_mortem_scenario=raw_adv.get("pre_mortem_scenario", "Capital exhausted before finding repeatable customer acquisition channel."),
            required_proof_points=raw_adv.get("required_proof_points", ["Pre-launch LOIs with locked pricing."]),
        )

        # Parse validation experiments
        raw_exps = raw_evaluation.get("validation_experiments", [])
        validation_experiments = [
            ValidationExperiment(
                id=e.get("id", f"exp-{i+1}"),
                name=e.get("name", f"Experiment {i+1}"),
                hypothesis_tested=e.get("hypothesis_tested", "Market demand validation"),
                method=e.get("method", "Targeted customer interviews"),
                metric_to_track=e.get("metric_to_track", "Conversion rate"),
                target_threshold=e.get("target_threshold", "> 10% positive commitment"),
                estimated_cost_usd=float(e.get("estimated_cost_usd", 100.0)),
                estimated_days=int(e.get("estimated_days", 7)),
                priority=e.get("priority", "High"),
            )
            for i, e in enumerate(raw_exps)
        ]

        # Parse roadmap
        raw_roadmap = raw_evaluation.get("roadmap", [])
        roadmap = [
            RoadmapPhase(
                phase=r.get("phase", f"Phase {i+1}"),
                title=r.get("title", "Execution Milestone"),
                milestones=r.get("milestones", []),
                kill_metric=r.get("kill_metric", "Lack of customer engagement"),
            )
            for i, r in enumerate(raw_roadmap)
        ]

        return AnalysisReportResponse(
            id=report_id,
            created_at=created_at_str,
            startup_name=startup.startup_name,
            tagline=startup.tagline,
            industry=startup.industry,
            target_customer=startup.target_customer,
            geographic_market=startup.geographic_market,
            business_model=startup.business_model,
            executive_summary=raw_evaluation.get("executive_summary", "Evaluation completed successfully."),
            score_report=score_report,
            competitors=competitors,
            adversarial_critique=adversarial_critique,
            evidence_sources=evidence_items,
            validation_experiments=validation_experiments,
            roadmap=roadmap,
            ai_provider=provider_name,
            is_mock=is_mock_mode,
            limitations_disclaimer=LIMITATIONS_DISCLAIMER,
        )
