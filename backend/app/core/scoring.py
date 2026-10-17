from typing import Dict, Any, List
from pydantic import BaseModel


class DimensionBreakdown(BaseModel):
    name: str
    weight: float
    raw_score: float  # 0 to 100
    weighted_score: float  # raw_score * weight
    reasoning: str
    strengths: List[str]
    risks: List[str]


class ScoreReport(BaseModel):
    overall_score: float  # 0 to 100
    grade: str  # "A", "B+", "B", "C+", "C", "D"
    verdict: str  # "Proceed with High Confidence", "Pivot Wedge First", "Needs Customer Validation", "High Risk / Reconsider"
    formula_explanation: str
    dimensions: Dict[str, DimensionBreakdown]
    penalties_applied: List[Dict[str, Any]]
    confidence_level: str  # "High (Verified Evidence)", "Moderate (Partial Evidence)", "Low (Hypothesis Only)"


def calculate_grade(score: float) -> str:
    if score >= 88:
        return "A"
    elif score >= 80:
        return "B+"
    elif score >= 72:
        return "B"
    elif score >= 64:
        return "C+"
    elif score >= 55:
        return "C"
    else:
        return "D"


def determine_verdict(score: float) -> str:
    if score >= 82:
        return "High Potential — Proceed to Customer Validation Experiments"
    elif score >= 70:
        return "Promising with Moderate Risk — Sharpen Wedge & Differentiate"
    elif score >= 55:
        return "Uncertain Feasibility — High Execution/Market Assumptions"
    else:
        return "Severe Structural Headwinds — Fundamental Pivot Recommended"


def compute_evaluation_score(
    raw_scores: Dict[str, float],
    reasoning_map: Dict[str, Dict[str, Any]],
    penalties: List[Dict[str, Any]],
    evidence_count: int,
) -> ScoreReport:
    """
    Computes a deterministic, explainable startup feasibility score.
    Weights:
      - Problem Clarity: 20%
      - Market Opportunity: 25%
      - Competitive Defensibility: 20%
      - Business Viability: 20%
      - Technical & Execution Feasibility: 15%
    """
    weights = {
        "problem_clarity": 0.20,
        "market_opportunity": 0.25,
        "competitive_defensibility": 0.20,
        "business_viability": 0.20,
        "technical_feasibility": 0.15,
    }

    dimensions: Dict[str, DimensionBreakdown] = {}
    base_score = 0.0

    for dim_key, weight in weights.items():
        raw = float(raw_scores.get(dim_key, 60.0))
        # Clamp 0-100
        raw = max(0.0, min(100.0, raw))
        weighted = round(raw * weight, 2)
        base_score += weighted

        meta = reasoning_map.get(dim_key, {})
        display_names = {
            "problem_clarity": "Problem Clarity & Pain Urgency",
            "market_opportunity": "Market Need & TAM Opportunity",
            "competitive_defensibility": "Competitive Moat & Defensibility",
            "business_viability": "Business Model & Unit Economics",
            "technical_feasibility": "Technical & Execution Feasibility",
        }

        dimensions[dim_key] = DimensionBreakdown(
            name=display_names.get(dim_key, dim_key.replace("_", " ").title()),
            weight=weight,
            raw_score=raw,
            weighted_score=weighted,
            reasoning=meta.get("reasoning", "Standard assessment based on input parameters."),
            strengths=meta.get("strengths", []),
            risks=meta.get("risks", []),
        )

    # Deduct penalties
    total_penalty = 0.0
    for p in penalties:
        pts = float(p.get("deduction", 0.0))
        total_penalty += pts

    final_score = max(5.0, min(100.0, round(base_score - total_penalty, 1)))
    grade = calculate_grade(final_score)
    verdict = determine_verdict(final_score)

    # Confidence based on real evidence records
    if evidence_count >= 3:
        confidence = "High (Backed by Multiple Verified External Sources)"
    elif evidence_count >= 1:
        confidence = "Moderate (Backed by Preliminary Search Evidence)"
    else:
        confidence = "Preliminary (Derived from Model Estimates & User Inputs)"

    formula = (
        "Overall Score = (0.20 * Problem) + (0.25 * Market) + (0.20 * Defensibility) + "
        "(0.20 * Business) + (0.15 * Technical) - Penalties"
    )

    return ScoreReport(
        overall_score=final_score,
        grade=grade,
        verdict=verdict,
        formula_explanation=formula,
        dimensions=dimensions,
        penalties_applied=penalties,
        confidence_level=confidence,
    )
