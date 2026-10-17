import json
import logging
import re
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import httpx

from app.core.config import settings
from app.schemas.analysis import StartupInput, EvidenceItem

logger = logging.getLogger(__name__)


SYSTEM_EVALUATION_PROMPT = """
You are VentureLens AI, an elite startup diligence partner, venture capitalist, and red-team advisor.
Your mission: evaluate the feasibility of the proposed startup idea using rigorous first-principles analysis.
You MUST be objective, analytical, and adversarial where necessary. Do NOT flatter the founder.
Distinguish between verified evidence and unvalidated founder assumptions.

You will be given the startup details and verified web search evidence.
You must return a valid JSON object matching the following structure exactly:

{
  "executive_summary": "Crisp 2-3 sentence thesis summarizing viability, core obstacle, and path forward.",
  "raw_scores": {
    "problem_clarity": 75,
    "market_opportunity": 70,
    "competitive_defensibility": 65,
    "business_viability": 68,
    "technical_feasibility": 80
  },
  "dimension_meta": {
    "problem_clarity": {
      "reasoning": "...",
      "strengths": ["...", "..."],
      "risks": ["...", "..."]
    },
    "market_opportunity": {
      "reasoning": "...",
      "strengths": ["...", "..."],
      "risks": ["...", "..."]
    },
    "competitive_defensibility": {
      "reasoning": "...",
      "strengths": ["...", "..."],
      "risks": ["...", "..."]
    },
    "business_viability": {
      "reasoning": "...",
      "strengths": ["...", "..."],
      "risks": ["...", "..."]
    },
    "technical_feasibility": {
      "reasoning": "...",
      "strengths": ["...", "..."],
      "risks": ["...", "..."]
    }
  },
  "penalties": [
    {
      "reason": "Name of severe risk",
      "deduction": 5.0,
      "explanation": "Why this points deduction was applied"
    }
  ],
  "competitors": [
    {
      "name": "Competitor 1",
      "type": "Direct Competitor",
      "description": "What they do",
      "strengths": ["Strength 1"],
      "weaknesses": ["Weakness 1"],
      "differentiator_wedge": "How the founder can win against them",
      "pricing_model": "Their pricing structure"
    }
  ],
  "adversarial_critique": {
    "investor_persona": "Pragmatic Series-A General Partner",
    "fatal_flaws": ["Flaw 1", "Flaw 2"],
    "untested_assumptions": ["Assumption 1", "Assumption 2"],
    "distribution_hurdles": ["Hurdle 1", "Hurdle 2"],
    "incumbent_threat_analysis": "How incumbents will respond",
    "pre_mortem_scenario": "How this startup dies in 18 months if unchecked",
    "required_proof_points": ["Proof point 1", "Proof point 2"]
  },
  "validation_experiments": [
    {
      "id": "exp-1",
      "name": "Smoke Test Landing Page",
      "hypothesis_tested": "Core value proposition demand",
      "method": "500 targeted LinkedIn impressions driving to email waitlist",
      "metric_to_track": "Click-to-lead conversion rate",
      "target_threshold": "> 8% conversion from verified ICP",
      "estimated_cost_usd": 250,
      "estimated_days": 7,
      "priority": "Critical (Do First)"
    }
  ],
  "roadmap": [
    {
      "phase": "Days 1-30",
      "title": "Problem-Solution Fit Validation",
      "milestones": ["Conduct 15 customer discovery interviews", "Validate willing-to-pay threshold"],
      "kill_metric": "Fewer than 4 of 15 prospects express urgent budget intent"
    },
    {
      "phase": "Days 31-60",
      "title": "Wedge MVP Deployment",
      "milestones": ["Build single-feature concierge prototype", "Onboard 3 beta design partners"],
      "kill_metric": "Zero beta customers complete week-2 active workflow"
    },
    {
      "phase": "Days 61-90",
      "title": "Early Retention & Unit Economics",
      "milestones": ["Convert 2 beta users to paid contracts", "Measure weekly NPS"],
      "kill_metric": "Inability to close first paying customer without custom services"
    }
  ]
}
"""


class BaseAIProvider(ABC):
    @abstractmethod
    async def generate_evaluation(
        self,
        startup: StartupInput,
        evidence: List[EvidenceItem]
    ) -> Dict[str, Any]:
        """Generate structured startup evaluation from input and research evidence."""
        pass


class GeminiProvider(BaseAIProvider):
    """
    Adapter for Google Gemini / Gemma API with JSON schema enforcement.
    """
    def __init__(self, api_key: str, model_name: str = "gemini-2.5-flash"):
        self.api_key = api_key
        self.model_name = model_name

    async def generate_evaluation(
        self,
        startup: StartupInput,
        evidence: List[EvidenceItem]
    ) -> Dict[str, Any]:
        evidence_context = "\n".join([
            f"- [{e.verification_status}] {e.title} ({e.url}): {e.snippet}"
            for e in evidence
        ])

        user_content = f"""
STARTUP SUBMISSION:
- Name: {startup.startup_name}
- Tagline: {startup.tagline or 'N/A'}
- Industry: {startup.industry}
- Geographic Market: {startup.geographic_market}
- Target Customer Profile: {startup.target_customer}
- Problem Statement: {startup.problem_statement}
- Proposed Solution: {startup.solution_description}
- Business Model: {startup.business_model}
- Available Budget: ${startup.available_budget_usd:,.2f}
- Timeframe to MVP: {startup.timeframe_months} months
- Known Competitors: {', '.join(startup.known_competitors) if startup.known_competitors else 'None stated'}
- Pricing Hypothesis: {startup.pricing_hypothesis or 'Unspecified'}
- Founder Notes: {startup.additional_notes or 'None'}

RETRIEVED WEB RESEARCH & EVIDENCE:
{evidence_context or 'No live search results available.'}

Perform the 5-stage evaluation and return ONLY valid JSON matching the specified format.
"""

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": SYSTEM_EVALUATION_PROMPT + "\n\n" + user_content}]}
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.2,
                "maxOutputTokens": 4096,
            }
        }

        async with httpx.AsyncClient(timeout=settings.AI_TIMEOUT_SECONDS) as client:
            try:
                response = await client.post(url, json=payload, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text_out = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        return json.loads(text_out)
                else:
                    logger.warning(f"Gemini API returned error {response.status_code}: {response.text}")
            except Exception as ex:
                logger.error(f"Gemini request failed: {ex}")

        # Fallback to Mock provider if API fails or quota exceeded
        logger.info("Falling back to deterministic mock provider due to API unavailability.")
        mock = MockAIProvider()
        return await mock.generate_evaluation(startup, evidence)


class OllamaProvider(BaseAIProvider):
    """
    Adapter for local Ollama running Gemma 2 / Gemma 4 / Llama 3 models.
    """
    def __init__(self, base_url: str = "http://localhost:11434", model_name: str = "gemma2:9b"):
        self.base_url = base_url
        self.model_name = model_name

    async def generate_evaluation(
        self,
        startup: StartupInput,
        evidence: List[EvidenceItem]
    ) -> Dict[str, Any]:
        evidence_text = "\n".join([f"- {e.title}: {e.snippet}" for e in evidence])
        prompt = f"{SYSTEM_EVALUATION_PROMPT}\n\nStartup: {startup.startup_name}\nProblem: {startup.problem_statement}\nSolution: {startup.solution_description}\nTarget: {startup.target_customer}\nEvidence:\n{evidence_text}"

        try:
            async with httpx.AsyncClient(timeout=settings.AI_TIMEOUT_SECONDS) as client:
                res = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model_name,
                        "prompt": prompt,
                        "format": "json",
                        "stream": False,
                    }
                )
                if res.status_code == 200:
                    body = res.json()
                    return json.loads(body.get("response", "{}"))
        except Exception as ex:
            logger.warning(f"Ollama local model failed: {ex}")

        mock = MockAIProvider()
        return await mock.generate_evaluation(startup, evidence)


class MockAIProvider(BaseAIProvider):
    """
    High-fidelity, deterministic evaluation generator for offline testing and hackathon demo reliability.
    Customized specifically to the user's input fields.
    """
    async def generate_evaluation(
        self,
        startup: StartupInput,
        evidence: List[EvidenceItem]
    ) -> Dict[str, Any]:
        name = startup.startup_name
        ind = startup.industry
        target = startup.target_customer
        budget = startup.available_budget_usd

        # Intelligent heuristic scoring based on provided parameters
        prob_score = 82.0 if len(startup.problem_statement) > 80 else 68.0
        mkt_score = 78.0 if "b2b" in startup.business_model.lower() or "saas" in startup.business_model.lower() else 70.0
        tech_score = 85.0 if budget >= 10000 else 65.0
        moat_score = 64.0  # Early startups typically have thin defensibility
        biz_score = 75.0 if startup.pricing_hypothesis else 62.0

        penalties = []
        if budget < 5000:
            penalties.append({
                "reason": "Sub-Scale Runway Risk",
                "deduction": 5.0,
                "explanation": "Budget under $5,000 provides insufficient buffer for customer acquisition experimentation.",
            })

        if not startup.pricing_hypothesis:
            penalties.append({
                "reason": "Unspecified Unit Economics",
                "deduction": 4.0,
                "explanation": "No clear willingness-to-pay hypothesis specified by founder.",
            })

        competitors = []
        if startup.known_competitors:
            for comp in startup.known_competitors[:3]:
                competitors.append({
                    "name": comp,
                    "type": "Direct Incumbent",
                    "description": f"Established platform serving {ind} with broader generalist features.",
                    "strengths": ["Brand recognition", "Enterprise customer base", "Pre-built integrations"],
                    "weaknesses": ["Slow deployment", "High enterprise contract minimums", "Clunky legacy UI"],
                    "differentiator_wedge": f"{name} offers a 10x faster self-serve setup specifically tuned for {target}.",
                    "pricing_model": "Enterprise annual seat licenses ($10k+ minimums)",
                })
        else:
            competitors.append({
                "name": "Legacy Manual Spreadsheets & Internal Scripts",
                "type": "Alternative Solution",
                "description": f"Internal workarounds used by {target} to solve the problem today.",
                "strengths": ["Zero software purchase cost", "Familiar to operators", "No procurement approval"],
                "weaknesses": ["Error-prone", "Consumes 15+ hours/week of staff time", "Non-compliant"],
                "differentiator_wedge": "Automates 90% of the manual repetitive overhead with audit-proof export.",
                "pricing_model": "Implicit labor overhead ($40,000+/year in wasted employee hours)",
            })

        return {
            "executive_summary": (
                f"{name} targets a compelling operational friction point in {ind}. "
                f"While the value proposition for {target} is conceptually strong, initial defensibility is narrow. "
                f"The priority must be securing 3-5 reference customers to validate willingness-to-pay before engineering feature complexity."
            ),
            "raw_scores": {
                "problem_clarity": prob_score,
                "market_opportunity": mkt_score,
                "competitive_defensibility": moat_score,
                "business_viability": biz_score,
                "technical_feasibility": tech_score,
            },
            "dimension_meta": {
                "problem_clarity": {
                    "reasoning": f"Problem statement clearly identifies operational bottlenecks for {target}, though willingness-to-pay elasticity requires empirical confirmation.",
                    "strengths": ["Specific ICP definition", "Quantifiable time/money waste identified"],
                    "risks": ["Risk of being a 'nice-to-have' vitamin rather than urgent painkiller"],
                },
                "market_opportunity": {
                    "reasoning": f"{ind} exhibits solid structural tailwinds with increasing digital adoption across {startup.geographic_market}.",
                    "strengths": ["Growing regulatory and efficiency pressures", "High concentration of potential accounts"],
                    "risks": ["Sales cycles may exceed 60 days if targeting enterprise buyers"],
                },
                "competitive_defensibility": {
                    "reasoning": "Product has low initial moat until proprietary workflow data and software integrations create platform switching costs.",
                    "strengths": ["Agile wedge compared to slow legacy enterprise incumbents"],
                    "risks": ["Low barriers to entry for well-funded fast followers"],
                },
                "business_viability": {
                    "reasoning": f"Business model ({startup.business_model}) matches industry standards for recurring software value delivery.",
                    "strengths": ["Recurring revenue potential", "Favorable gross margin ceiling (>80%)"],
                    "risks": ["Customer Acquisition Cost (CAC) might outstrip Year 1 LTV without organic wedge"],
                },
                "technical_feasibility": {
                    "reasoning": f"Core MVP is technically solvable within the {startup.timeframe_months}-month timeframe with standard full-stack architectures.",
                    "strengths": ["No fundamental scientific or hardware breakthroughs required", "Standard API integrations"],
                    "risks": ["Data normalization across fragmented customer sources"],
                },
            },
            "penalties": penalties,
            "competitors": competitors,
            "adversarial_critique": {
                "investor_persona": "Skeptical Early-Stage General Partner (Adversarial Red-Team)",
                "fatal_flaws": [
                    "Willingness-to-pay is currently assumed based on qualitative interest, not hard budget allocation.",
                    f"Incumbent software providers can replicate this wedge within 2 quarters if customer traction is proven.",
                    f"Customer acquisition strategy for {target} lacks a zero-marginal-cost distribution flywheel."
                ],
                "untested_assumptions": [
                    "Target buyers have discretionary budget authority below $10k without committee signoff.",
                    "Implementation friction is low enough that operators will switch from existing routines.",
                    "Customer churn will remain under 2% monthly after initial onboarding novelty fades."
                ],
                "distribution_hurdles": [
                    "Outbound cold email conversion in B2B markets is at historic lows (<1.5% meeting rate).",
                    "Trade association or channel partner distribution requires lengthy partnership negotiations."
                ],
                "incumbent_threat_analysis": (
                    "Established players possess distribution scale and balance sheets. "
                    "Their primary counter-strategy will be bundling a similar feature set for free into existing contracts."
                ),
                "pre_mortem_scenario": (
                    f"18 months post-launch: {name} spent $12,000 building an elaborate product with 40 features. "
                    "Only 2 customers pay regular subscriptions because the sales cycle was too exhausting for the small team. "
                    "Runway expires before discovering an efficient CAC distribution channel."
                ),
                "required_proof_points": [
                    "3 signed Letters of Intent (LOIs) with explicit price points before writing production code.",
                    "Documented customer onboarding completion in under 15 minutes without human support.",
                    "Verifiable CAC payback period under 8 months."
                ]
            },
            "validation_experiments": [
                {
                    "id": "exp-1",
                    "name": "Pre-Sale LOI / Deposit Campaign",
                    "hypothesis_tested": f"{target} will commit budget to solve this pain point today.",
                    "method": "Conduct 15 structured customer discovery calls; ask for a $100 refundable pilot deposit or formal LOI at the end.",
                    "metric_to_track": "Percentage of discovery leads willing to sign an LOI or pay deposit",
                    "target_threshold": "At least 3 out of 15 prospects (20%) commit written intent",
                    "estimated_cost_usd": 150.0,
                    "estimated_days": 10,
                    "priority": "Critical (Do First)"
                },
                {
                    "id": "exp-2",
                    "name": "Concierge / Wizard of Oz Pilot",
                    "hypothesis_tested": "The proposed manual-to-automated workflow genuinely delivers 10x value.",
                    "method": "Manually execute the deliverable for 2 design partners behind a simple web form before building backend automation.",
                    "metric_to_track": "Partner time-saved and subjective satisfaction score (NPS)",
                    "target_threshold": "100% of pilot partners confirm > 5 hours saved weekly",
                    "estimated_cost_usd": 100.0,
                    "estimated_days": 14,
                    "priority": "High"
                },
                {
                    "id": "exp-3",
                    "name": "Search Intent & Cold Outbound Diagnostic",
                    "hypothesis_tested": "Organic customer acquisition can be achieved with positive unit economics.",
                    "method": "Run targeted search / LinkedIn micro-campaign testing 3 value proposition headlines.",
                    "metric_to_track": "Click-Through-Rate (CTR) and Waitlist Conversion Rate",
                    "target_threshold": "> 3.5% CTR and > 12% landing page conversion to discovery call",
                    "estimated_cost_usd": 300.0,
                    "estimated_days": 7,
                    "priority": "Medium"
                }
            ],
            "roadmap": [
                {
                    "phase": "Days 1-30",
                    "title": "Problem-Solution Discovery & Hard Proof",
                    "milestones": [
                        f"Interview 20 verified {target} personas",
                        "Extract 3 non-negotiable feature requirements",
                        "Secure 3 signed Letters of Intent with explicit pricing"
                    ],
                    "kill_metric": "If fewer than 3 prospects confirm urgent pain, pivot target vertical immediately."
                },
                {
                    "phase": "Days 31-60",
                    "title": "Single-Feature Wedge Prototype",
                    "milestones": [
                        "Build minimalist MVP focused solely on the primary bottleneck",
                        "Deploy pilot to the 3 LOI signers",
                        "Measure weekly active usage and qualitative feedback"
                    ],
                    "kill_metric": "If zero pilot users use the product weekly without reminders, halt development."
                },
                {
                    "phase": "Days 61-90",
                    "title": "Paid Conversion & Retention Loop",
                    "milestones": [
                        "Transition pilot users to paid recurring billing",
                        "Measure net referral velocity",
                        "Document repeatable sales script for 10 new accounts"
                    ],
                    "kill_metric": "Inability to convert at least 2 pilots to paid contracts signals weak willingness-to-pay."
                }
            ]
        }


def get_ai_provider() -> BaseAIProvider:
    provider = settings.AI_PROVIDER.lower().strip()
    if provider == "gemini":
        if settings.GEMINI_API_KEY:
            return GeminiProvider(api_key=settings.GEMINI_API_KEY, model_name=settings.GEMINI_MODEL)
        else:
            logger.warning("GEMINI_API_KEY not configured. Falling back to MockAIProvider.")
            return MockAIProvider()
    elif provider == "ollama":
        return OllamaProvider(base_url=settings.OLLAMA_BASE_URL, model_name=settings.OLLAMA_MODEL)
    else:
        return MockAIProvider()
