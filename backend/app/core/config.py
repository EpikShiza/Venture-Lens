import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

# Dynamically locate project root directory containing .env
# config.py path: <root>/backend/app/core/config.py -> 4 levels up
CURRENT_FILE = Path(__file__).resolve()
ROOT_DIR = CURRENT_FILE.parent.parent.parent.parent
ENV_FILE_PATH = ROOT_DIR / ".env"


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables and .env file.
    All keys have sensible hackathon defaults so the app runs out-of-the-box.
    """
    PROJECT_NAME: str = "VentureLens"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # AI Provider: "mock", "gemini", "gemma", or "ollama"
    AI_PROVIDER: str = "mock"
    
    # Gemini / Gemma API Key & Model
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMMA_MODEL: str = "gemma-4-26b-a4b-it"  # Official Gemma 4 on Gemini API
    
    # Local Ollama configuration (if AI_PROVIDER="ollama")
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "gemma4:e4b"  # Default Gemma 4 Ollama tag
    
    # Search Provider: "mock", "duckduckgo", or "tavily"
    SEARCH_PROVIDER: str = "duckduckgo"
    TAVILY_API_KEY: Optional[str] = None
    
    # Database
    DATABASE_URL: str = "sqlite:///./venturelens.db"
    
    # CORS Origins
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # AI & Search Request Timeouts (Seconds)
    AI_TIMEOUT_SECONDS: int = 45
    SEARCH_TIMEOUT_SECONDS: int = 15

    model_config = SettingsConfigDict(
        env_file=[str(ENV_FILE_PATH), ".env", "../.env"],
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
