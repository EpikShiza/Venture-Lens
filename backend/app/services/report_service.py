import json
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.models import AnalysisReportModel
from app.schemas.analysis import (
    StartupInput,
    AnalysisReportResponse,
    AnalysisSummaryItem,
)


class ReportService:
    @staticmethod
    def save_report(
        db: Session,
        report: AnalysisReportResponse,
        input_data: StartupInput
    ) -> AnalysisReportModel:
        db_report = AnalysisReportModel(
            id=report.id,
            startup_name=report.startup_name,
            tagline=report.tagline,
            industry=report.industry,
            target_customer=report.target_customer,
            geographic_market=report.geographic_market,
            business_model=report.business_model,
            overall_score=report.score_report.overall_score,
            grade=report.score_report.grade,
            verdict=report.score_report.verdict,
            input_payload=input_data.model_dump(),
            report_data=report.model_dump(),
            ai_provider=report.ai_provider,
            is_mock=report.is_mock,
        )
        db.add(db_report)
        db.commit()
        db.refresh(db_report)
        return db_report

    @staticmethod
    def list_reports(db: Session, query: Optional[str] = None) -> List[AnalysisSummaryItem]:
        q = db.query(AnalysisReportModel)
        if query:
            pattern = f"%{query}%"
            q = q.filter(
                (AnalysisReportModel.startup_name.ilike(pattern)) |
                (AnalysisReportModel.industry.ilike(pattern))
            )
        records = q.order_by(AnalysisReportModel.created_at.desc()).all()
        return [
            AnalysisSummaryItem(
                id=r.id,
                startup_name=r.startup_name,
                tagline=r.tagline,
                industry=r.industry,
                overall_score=r.overall_score,
                grade=r.grade,
                verdict=r.verdict,
                ai_provider=r.ai_provider,
                is_mock=r.is_mock,
                created_at=r.created_at.isoformat() if r.created_at else "",
            )
            for r in records
        ]

    @staticmethod
    def get_report(db: Session, report_id: str) -> Optional[AnalysisReportResponse]:
        record = db.query(AnalysisReportModel).filter(AnalysisReportModel.id == report_id).first()
        if not record:
            return None
        # Return parsed Pydantic object
        return AnalysisReportResponse(**record.report_data)

    @staticmethod
    def delete_report(db: Session, report_id: str) -> bool:
        record = db.query(AnalysisReportModel).filter(AnalysisReportModel.id == report_id).first()
        if not record:
            return False
        db.delete(record)
        db.commit()
        return True

    @staticmethod
    def generate_markdown_export(report: AnalysisReportResponse) -> str:
        score = report.score_report
        adv = report.adversarial_critique

        dims_md = ""
        for key, dim in score.dimensions.items():
            dims_md += f"""
### {dim.name} (Weight: {int(dim.weight*100)}%)
- **Score:** {dim.raw_score}/100 (Weighted Contribution: {dim.weighted_score})
- **Reasoning:** {dim.reasoning}
- **Strengths:** {', '.join(dim.strengths)}
- **Risks:** {', '.join(dim.risks)}
"""

        comps_md = ""
        for c in report.competitors:
            comps_md += f"""
#### {c.name} ({c.type})
- **Overview:** {c.description}
- **Strengths:** {', '.join(c.strengths)}
- **Weaknesses:** {', '.join(c.weaknesses)}
- **VentureLens Wedge:** {c.differentiator_wedge}
- **Pricing:** {c.pricing_model or 'Unspecified'}
"""

        exps_md = ""
        for e in report.validation_experiments:
            exps_md += f"""
- **[{e.priority}] {e.name}**: {e.hypothesis_tested}
  - *Method:* {e.method}
  - *Target Metric:* {e.metric_to_track} ({e.target_threshold})
  - *Budget & Timeline:* ${e.estimated_cost_usd} | {e.estimated_days} days
"""

        evidence_md = ""
        for ev in report.evidence_sources:
            evidence_md += f"""
- [{ev.verification_status}] [{ev.title}]({ev.url})
  - *Snippet:* {ev.snippet}
  - *Relevance:* {ev.relevance_note}
"""

        md = f"""# VentureLens Startup Feasibility Report: {report.startup_name}
**Tagline:** {report.tagline or 'N/A'}  
**Industry:** {report.industry} | **Geographic Market:** {report.geographic_market}  
**Business Model:** {report.business_model}  
**Date of Evaluation:** {report.created_at}  
**Engine:** {report.ai_provider} {'(Mock Mode)' if report.is_mock else '(Live AI)'}

---

## Executive Summary
{report.executive_summary}

---

## Feasibility Score & Verdict
- **Overall Feasibility Score:** {score.overall_score} / 100
- **Grade:** {score.grade}
- **Verdict:** {score.verdict}
- **Confidence Level:** {score.confidence_level}
- **Formula:** `{score.formula_explanation}`

---

## 5-Dimensional Evaluation Breakdown
{dims_md}

---

## Adversarial Investor Red-Team Review
> **Investor Persona:** {adv.investor_persona}

### Fatal Flaws & Blindspots
{chr(10).join([f"- {flaw}" for flaw in adv.fatal_flaws])}

### Untested Assumptions
{chr(10).join([f"- {ass}" for ass in adv.untested_assumptions])}

### Distribution Hurdles
{chr(10).join([f"- {dh}" for dh in adv.distribution_hurdles])}

### Incumbent Retaliation Threat
{adv.incumbent_threat_analysis}

### Pre-Mortem Scenario (How this startup fails in 18 months)
*{adv.pre_mortem_scenario}*

### Required Proof Points Before Scaling
{chr(10).join([f"- {p}" for p in adv.required_proof_points])}

---

## Competitor Landscape & Differentiator Wedge
{comps_md}

---

## Recommended Actionable Validation Experiments
{exps_md}

---

## Verified Evidence & Market Citations
{evidence_md or 'No external web citations logged.'}

---

## Disclaimer & Limitations
{report.limitations_disclaimer}
"""
        return md.strip()
