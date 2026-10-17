VentureLens
Turn startup ideas into evidence-backed decisions.

VentureLens is an open-source, evidence-backed startup feasibility and diligence platform. It combines competitor discovery, transparent scoring, and adversarial investor analysis to help founders test their assumptions before investing time and money.

1. Problem Statement

Founders, student entrepreneurs, and hackathon teams often build products based on unvalidated assumptions and incomplete market research.

VentureLens aims to help users:

Discover competitors and alternatives.
Separate sourced evidence from hypotheses.
Challenge assumptions from an investor's perspective.
Understand transparent feasibility scores.
Design practical validation experiments before building.
2. Proposed Solution

VentureLens is designed around a five-stage workflow:

Startup idea submission and normalization.
Market and competitor research.
Deterministic scoring across feasibility dimensions.
Adversarial investor review and failure analysis.
Evidence review, validation experiments, and report generation.

Actual research and model capabilities depend on the configured providers. Mock-mode results are for demonstration and testing and must not be interpreted as live research.

3. Key Features
Evidence-aware analysis: Distinguishes sourced findings from estimates and unverified hypotheses.
Adversarial investor review: Identifies risks, weak assumptions, and potential failure scenarios.
Transparent scoring: Uses explicit scoring criteria rather than presenting a model-generated score as a probability of success.
Validation experiments: Suggests practical ways to test demand and reduce uncertainty.
Report persistence: Supports saving and revisiting analyses, subject to the implemented application features.
Configurable AI and search providers: Supports the providers implemented and enabled in the application.
4. Architecture

The intended architecture includes:

Frontend: React, Vite, and TypeScript.
Backend: FastAPI and Pydantic.
AI integration: A configurable model-provider adapter.
Research: Configurable search integration.
Scoring: Application-side feasibility scoring.
Persistence: SQLite.

The precise implementation and supported providers should be verified against the source code.

5. Technology Stack
Layer	Technology
Frontend	React, Vite, TypeScript
Styling	Tailwind CSS, if configured
Backend	Python, FastAPI, Pydantic
Database	SQLite, SQLAlchemy
AI	Configured model provider or mock provider
Research	Configured search provider
Testing	pytest and available frontend tests
6. Prerequisites
Python 3.10 or later, compatible with the project dependencies.
Node.js and npm, compatible with the frontend dependencies.
Git.
7. Installation

Clone the repository:

git clone https://github.com/EpikShiza/Venture-Lens.git
cd Venture-Lens


Create a local environment file from the example:

Windows PowerShell

Copy-Item .env.example .env


Create and activate the Python virtual environment:

python -m venv .venv
.\.venv\Scripts\Activate.ps1


Install backend dependencies:

pip install -r backend\requirements.txt


Install frontend dependencies:

cd frontend
npm install
cd ..


These commands assume the corresponding files and directories exist in the repository.

8. Running the Application

Start the backend from the project root in one terminal:

$env:PYTHONPATH = "backend"
uvicorn app.main:app --reload --port 8000


If the project's entry point differs, use the actual module path defined by the implementation.

Start the frontend in a second terminal:

cd frontend
npm run dev


When the services start successfully, use the local frontend URL printed by Vite. If configured, the FastAPI API documentation is available at http://localhost:8000/docs.

9. AI and Research Configuration

Configure provider settings in your local .env file.

Mock mode may return deterministic demonstration responses rather than live model analysis.
Real model inference requires a supported provider, a valid API key, and a compatible model identifier.
Live research requires a functioning search integration.
Do not treat generated hypotheses as verified facts.
Never commit .env or expose API keys in frontend code.

For Google AI configuration, consult the official Google AI Studio and Gemma documentation.

10. Testing

Run the backend tests, if present:

$env:PYTHONPATH = "backend"
.\.venv\Scripts\pytest.exe backend\tests -v


Build the frontend:

cd frontend
npm run build


Record actual test results rather than assuming that the application works because the commands are documented.

11. Security and Privacy
Keep API keys in local environment variables.
Exclude .env and other secrets from Git.
Treat user submissions and retrieved web content as untrusted input.
Validate model outputs before using them.
Do not fabricate citations, market statistics, or customer research.
Review database persistence and provider data-handling policies before deployment.
12. License

This project is intended to use the Apache License, Version 2.0. See LICENSE for the actual license text.