from app.core.scoring import compute_evaluation_score, calculate_grade, determine_verdict


def test_grade_boundaries():
    assert calculate_grade(92.0) == "A"
    assert calculate_grade(85.0) == "B+"
    assert calculate_grade(75.0) == "B"
    assert calculate_grade(68.0) == "C+"
    assert calculate_grade(58.0) == "C"
    assert calculate_grade(40.0) == "D"


def test_verdict_mapping():
    assert "High Potential" in determine_verdict(85.0)
    assert "Promising" in determine_verdict(75.0)
    assert "Uncertain" in determine_verdict(60.0)
    assert "Severe Structural Headwinds" in determine_verdict(45.0)


def test_compute_evaluation_score_weights():
    # Test perfect 100 on all dimensions
    raw_scores = {
        "problem_clarity": 100.0,
        "market_opportunity": 100.0,
        "competitive_defensibility": 100.0,
        "business_viability": 100.0,
        "technical_feasibility": 100.0,
    }
    reasoning_map = {}
    penalties = []
    
    report = compute_evaluation_score(raw_scores, reasoning_map, penalties, evidence_count=3)
    assert report.overall_score == 100.0
    assert report.grade == "A"
    assert "High (Backed by Multiple Verified External Sources)" in report.confidence_level

    # Check weighted dimension values
    dims = report.dimensions
    assert dims["problem_clarity"].weighted_score == 20.0
    assert dims["market_opportunity"].weighted_score == 25.0
    assert dims["competitive_defensibility"].weighted_score == 20.0
    assert dims["business_viability"].weighted_score == 20.0
    assert dims["technical_feasibility"].weighted_score == 15.0


def test_compute_evaluation_score_with_penalties():
    raw_scores = {
        "problem_clarity": 80.0,
        "market_opportunity": 80.0,
        "competitive_defensibility": 80.0,
        "business_viability": 80.0,
        "technical_feasibility": 80.0,
    }
    # Base score = 80.0
    penalties = [
        {"reason": "Regulatory hurdle", "deduction": 10.0, "explanation": "Pending audit"},
        {"reason": "Crowded niche", "deduction": 5.0, "explanation": "High competitor density"},
    ]
    report = compute_evaluation_score(raw_scores, {}, penalties, evidence_count=1)
    
    # 80.0 - 15.0 = 65.0
    assert report.overall_score == 65.0
    assert report.grade == "C+"
    assert len(report.penalties_applied) == 2
    assert "Moderate" in report.confidence_level
