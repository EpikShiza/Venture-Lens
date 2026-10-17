import pytest


def test_root_endpoint(client):
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["service"] == "VentureLens"
    assert "tagline" in data


def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["database_connected"] is True


def test_system_status(client):
    res = client.get("/api/system/status")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "operational"
    assert "ai_provider" in data
    assert "search_provider" in data


def test_create_and_retrieve_analysis(client):
    payload = {
        "startup_name": "SensorIQ",
        "tagline": "Predictive maintenance IoT sensors for food cold-chains",
        "problem_statement": "Commercial supermarkets lose over $40,000 annually per store due to unpredicted compressor failures in refrigeration units.",
        "solution_description": "Plug-and-play vibration and temperature telemetry sensors with predictive failure alerts delivered via mobile push notifications.",
        "target_customer": "Facilities and maintenance directors at regional grocery store chains (10-50 locations).",
        "geographic_market": "United States Midwest",
        "industry": "IoT / Commercial PropTech",
        "business_model": "Hardware setup fee ($500/store) + $99/store/month monitoring subscription",
        "available_budget_usd": 12000.0,
        "timeframe_months": 6,
        "known_competitors": ["Samsara", "Phononic"],
        "pricing_hypothesis": "$99 per store monthly subscription fee",
        "additional_notes": "Conducted 5 interviews with local grocery managers confirming pain severity."
    }

    # 1. Create analysis
    post_res = client.post("/api/analyses", json=payload)
    assert post_res.status_code == 201
    report = post_res.json()
    assert report["startup_name"] == "SensorIQ"
    assert "id" in report
    assert "score_report" in report
    assert report["score_report"]["overall_score"] > 0
    assert len(report["competitors"]) > 0
    assert "adversarial_critique" in report
    assert len(report["validation_experiments"]) > 0
    assert len(report["roadmap"]) > 0
    
    analysis_id = report["id"]

    # 2. Retrieve analysis by ID
    get_res = client.get(f"/api/analyses/{analysis_id}")
    assert get_res.status_code == 200
    retrieved = get_res.json()
    assert retrieved["id"] == analysis_id
    assert retrieved["startup_name"] == "SensorIQ"

    # 3. List analyses
    list_res = client.get("/api/analyses")
    assert list_res.status_code == 200
    items = list_res.json()
    assert any(item["id"] == analysis_id for item in items)

    # 4. Search analyses with filter
    filter_res = client.get("/api/analyses?q=SensorIQ")
    assert filter_res.status_code == 200
    filter_items = filter_res.json()
    assert len(filter_items) >= 1
    assert filter_items[0]["startup_name"] == "SensorIQ"

    # 5. Export analysis as Markdown
    export_res = client.get(f"/api/analyses/{analysis_id}/export?format=markdown")
    assert export_res.status_code == 200
    assert "# VentureLens Startup Feasibility Report: SensorIQ" in export_res.text
    assert "## Feasibility Score & Verdict" in export_res.text
    assert "## Adversarial Investor Red-Team Review" in export_res.text

    # 6. Delete analysis
    del_res = client.delete(f"/api/analyses/{analysis_id}")
    assert del_res.status_code == 204

    # 7. Verify deletion
    verify_res = client.get(f"/api/analyses/{analysis_id}")
    assert verify_res.status_code == 404


def test_seed_demo_data(client):
    res = client.post("/api/seed")
    assert res.status_code == 200
    data = res.json()
    assert "Successfully seeded" in data["message"]

    # Verify seed items exist in list
    list_res = client.get("/api/analyses")
    assert list_res.status_code == 200
    items = list_res.json()
    assert len(items) >= 2
