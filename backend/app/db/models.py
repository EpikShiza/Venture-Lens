import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, JSON
from app.db.database import Base


class AnalysisReportModel(Base):
    __tablename__ = "analysis_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    startup_name = Column(String(255), nullable=False, index=True)
    tagline = Column(String(500), nullable=True)
    industry = Column(String(100), nullable=False, index=True)
    target_customer = Column(String(255), nullable=False)
    geographic_market = Column(String(100), nullable=False)
    business_model = Column(String(100), nullable=False)
    
    overall_score = Column(Float, nullable=False)
    grade = Column(String(10), nullable=False)
    verdict = Column(String(255), nullable=False)
    
    # Store complete input and structured report
    input_payload = Column(JSON, nullable=False)
    report_data = Column(JSON, nullable=False)
    
    # Provider metadata for transparency
    ai_provider = Column(String(50), nullable=False)
    is_mock = Column(Boolean, default=False, nullable=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
