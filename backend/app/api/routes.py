import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.db.models import AnalysisReportModel
from app.schemas.analysis import (
    StartupInput,
    AnalysisReportResponse,
    AnalysisSummaryItem,
    SystemStatusResponse,
)
from app.services.evaluator import EvaluationOrchestrator
from app.services.report_service import ReportService
from fixtures.seed_data import SEED_REPORTS

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint to verify backend and database connectivity."""
    db_ok = True
    try:
        db.execute(AnalysisReportModel.__table__.select().limit(1))
    except Exception:
        db_ok = False

    return {
        "status": "healthy" if db_ok else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database_connected": db_ok,
    }


@router.get("/system/status", response_model=SystemStatusResponse, tags=["System"])
def get_system_status(db: Session = Depends(get_db)):
    """Provides transparent runtime info on configured AI and search providers."""
    count = db.query(AnalysisReportModel).count()
    return SystemStatusResponse(
        status="operational",
        ai_provider=settings.AI_PROVIDER,
        ai_model=settings.GEMINI_MODEL if settings.AI_PROVIDER == "gemini" else (settings.OLLAMA_MODEL if settings.AI_PROVIDER == "ollama" else "deterministic-mock"),
        search_provider=settings.SEARCH_PROVIDER,
        gemini_key_configured=bool(settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 5),
        tavily_key_configured=bool(settings.TAVILY_API_KEY and len(settings.TAVILY_API_KEY) > 5),
        database_url_type="sqlite" if "sqlite" in settings.DATABASE_URL else "postgresql",
        total_saved_reports=count,
    )


@router.post(
    "/analyses",
    response_model=AnalysisReportResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Analysis"],
)
async def create_analysis(
    startup_input: StartupInput,
    db: Session = Depends(get_db),
):
    """
    Submits a startup idea for 5-stage evidence-backed feasibility analysis.
    Executes search, criterion scoring, red-team diligence, and persists report.
    """
    logger.info(f"Received analysis request for startup: {startup_input.startup_name}")
    try:
        orchestrator = EvaluationOrchestrator()
        report = await orchestrator.run_evaluation(startup_input)
        ReportService.save_report(db, report, startup_input)
        return report
    except Exception as ex:
        logger.error(f"Error during evaluation execution: {ex}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Startup evaluation failed: {str(ex)}",
        )


@router.get(
    "/analyses",
    response_model=List[AnalysisSummaryItem],
    tags=["Analysis"],
)
def list_analyses(
    q: Optional[str] = Query(None, description="Search term for startup name or industry"),
    db: Session = Depends(get_db),
):
    """Retrieve all saved startup evaluations."""
    return ReportService.list_reports(db, query=q)


@router.get(
    "/analyses/{analysis_id}",
    response_model=AnalysisReportResponse,
    tags=["Analysis"],
)
def get_analysis_by_id(
    analysis_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve the full detailed evaluation report by its unique ID."""
    report = ReportService.get_report(db, analysis_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{analysis_id}' was not found.",
        )
    return report


@router.delete(
    "/analyses/{analysis_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Analysis"],
)
def delete_analysis(
    analysis_id: str,
    db: Session = Depends(get_db),
):
    """Delete a saved evaluation report by its ID."""
    success = ReportService.delete_report(db, analysis_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{analysis_id}' was not found.",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/analyses/{analysis_id}/export",
    tags=["Analysis"],
)
def export_analysis(
    analysis_id: str,
    format: str = Query("json", pattern="^(json|markdown|md)$"),
    db: Session = Depends(get_db),
):
    """
    Export the evaluation report in structured JSON or clean formatted Markdown.
    """
    report = ReportService.get_report(db, analysis_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{analysis_id}' was not found.",
        )

    if format in ["markdown", "md"]:
        md_text = ReportService.generate_markdown_export(report)
        return Response(
            content=md_text,
            media_type="text/markdown",
            headers={"Content-Disposition": f"attachment; filename=venturelens_{report.startup_name.lower().replace(' ', '_')}.md"},
        )
    else:
        return report


@router.post("/seed", tags=["Demo"])
def seed_demo_data(db: Session = Depends(get_db)):
    """Seeds sample benchmark reports into database for immediate hackathon demonstration."""
    inserted = 0
    for seed in SEED_REPORTS:
        existing = db.query(AnalysisReportModel).filter(AnalysisReportModel.id == seed["id"]).first()
        if not existing:
            rec = AnalysisReportModel(
                id=seed["id"],
                startup_name=seed["startup_name"],
                tagline=seed.get("tagline"),
                industry=seed["industry"],
                target_customer=seed["target_customer"],
                geographic_market=seed["geographic_market"],
                business_model=seed["business_model"],
                overall_score=seed["score_report"]["overall_score"],
                grade=seed["score_report"]["grade"],
                verdict=seed["score_report"]["verdict"],
                input_payload=seed.get("input_payload", {}),
                report_data=seed,
                ai_provider="mock_verified_fixture",
                is_mock=True,
            )
            db.add(rec)
            inserted += 1
    db.commit()
    return {"message": f"Successfully seeded {inserted} demo startup analyses."}
