import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import router as api_router
from app.core.config import settings
from app.db.database import init_db, SessionLocal
from app.db.models import AnalysisReportModel
from fixtures.seed_data import SEED_REPORTS

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("venturelens")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager: initializes database tables and seeds demo benchmarks if empty."""
    logger.info("Initializing database schema...")
    init_db()
    
    # Auto-seed initial demo reports if database is fresh
    try:
        db = SessionLocal()
        count = db.query(AnalysisReportModel).count()
        if count == 0:
            logger.info("Fresh database detected. Auto-seeding benchmark demo reports...")
            for seed in SEED_REPORTS:
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
            db.commit()
            logger.info(f"Successfully auto-seeded {len(SEED_REPORTS)} benchmark reports.")
        db.close()
    except Exception as e:
        logger.warning(f"Auto-seed check encountered non-fatal error: {e}")

    yield
    logger.info("Shutting down VentureLens backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="VentureLens: Turn startup ideas into evidence-backed decisions. Automated feasibility diligence, competitor search, and adversarial investor red-teaming.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for local development (supports any localhost port without wildcard conflicts)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"An unexpected server error occurred: {str(exc)}"},
    )


# Mount API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
def root_status():
    return {
        "service": settings.PROJECT_NAME,
        "tagline": "Turn startup ideas into evidence-backed decisions.",
        "version": settings.VERSION,
        "api_docs": "/docs",
        "health": "/api/health",
        "system_status": "/api/system/status",
    }
