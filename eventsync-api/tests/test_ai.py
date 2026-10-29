import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_generate_plan_endpoint():
    payload = {
        "event_type": "wedding",
        "total_budget": 12000.0,
        "date": "2026-12-15",
        "guest_count": 75,
        "constraints": "Strictly plant-based catering and organic flowers",
        "theme": "Nordic Minimalist Botanical"
    }
    response = client.post("/api/generate-plan", json=payload)
    assert response.status_code == 200
    data = response.json()

    # 1. Verify hourly timeline
    assert "timeline" in data
    assert isinstance(data["timeline"], list)
    assert len(data["timeline"]) >= 3
    for step in data["timeline"]:
        assert "time" in step
        assert "activity" in step
        assert "description" in step
        assert "eco_tip" in step

    # 2. Verify 3 personalized out-of-the-box vendor ideas
    assert "vendor_ideas" in data
    assert isinstance(data["vendor_ideas"], list)
    assert len(data["vendor_ideas"]) == 3
    for vendor in data["vendor_ideas"]:
        assert "name" in vendor
        assert "category" in vendor
        assert "estimated_cost" in vendor
        assert "is_eco_friendly" in vendor
        assert "unique_pitch" in vendor

    # 3. Verify sustainability score out of 100
    assert "sustainability" in data
    sustainability = data["sustainability"]
    assert "score" in sustainability
    assert 0 <= sustainability["score"] <= 100
    assert "summary" in sustainability
    assert "key_recommendations" in sustainability
    assert len(sustainability["key_recommendations"]) >= 1

    # Verify budget breakdown
    assert "estimated_budget_breakdown" in data
    assert isinstance(data["estimated_budget_breakdown"], dict)

def test_adjust_plan_endpoint_rain():
    # Generate initial plan
    initial_res = client.post("/api/generate-plan", json={
        "event_type": "wedding",
        "total_budget": 20000.0,
        "guest_count": 100,
        "theme": "Outdoor Garden Nuptials"
    })
    assert initial_res.status_code == 200
    current_plan = initial_res.json()

    # Apply rain adjustment
    adjust_payload = {
        "current_plan_data": current_plan,
        "user_command": "It is going to rain, move everything indoors"
    }
    response = client.post("/api/adjust-plan", json=adjust_payload)
    assert response.status_code == 200
    data = response.json()

    assert "timeline" in data
    assert "copilot_message" in data
    assert "instant_action_items" in data
    assert len(data["instant_action_items"]) >= 1
    # Check that indoor shift was reflected
    assert "rain" in data["copilot_message"].lower() or "shelter" in data["copilot_message"].lower() or "indoor" in data["copilot_message"].lower() or "weather" in data["copilot_message"].lower()

def test_adjust_plan_endpoint_budget_reduction():
    initial_res = client.post("/api/generate-plan", json={
        "event_type": "birthday",
        "total_budget": 10000.0,
        "guest_count": 50,
        "theme": "Synthwave Rooftop"
    })
    current_plan = initial_res.json()

    adjust_payload = {
        "current_plan_data": current_plan,
        "user_command": "Cut the budget by 10%"
    }
    response = client.post("/api/adjust-plan", json=adjust_payload)
    assert response.status_code == 200
    data = response.json()

    assert data["total_budget"] < 10000.0
    assert "copilot_message" in data

def test_operational_pivot_endpoint():
    payload = {
        "incident": "Unexpected squall winds threatening open-air wedding canopy",
        "event_type": "wedding",
        "event_title": "Garden Solarium Wedding",
        "affected_areas": ["Open lawn seating", "Floral canopy"]
    }
    response = client.post("/api/operational/pivot", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "incident" in data
    assert "severity" in data
    assert "instant_action_plan" in data
    assert len(data["instant_action_plan"]) >= 1
    assert "timeline_adjustments" in data
    assert "vendor_emergency_alerts" in data
    assert "sustainability_safeguard" in data
