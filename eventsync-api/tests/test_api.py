import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_and_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "gemini_configured" in data

def test_get_events():
    response = client.get("/api/events")
    assert response.status_code == 200
    events = response.json()
    assert isinstance(events, list)
    assert len(events) >= 1
    assert "title" in events[0]
    assert "sustainability_score" in events[0]

def test_create_and_get_single_event():
    new_event = {
        "title": "Solar Harvest Festival",
        "event_type": "community",
        "date": "2026-11-28T10:00:00Z",
        "total_budget": 5000.0,
        "sustainability_score": 95,
        "guest_count": 200,
        "location": "Riverfront Community Grounds",
        "constraints": "Zero single-use plastics"
    }
    create_res = client.post("/api/events", json=new_event)
    assert create_res.status_code == 201
    created = create_res.json()
    assert created["title"] == "Solar Harvest Festival"
    event_id = created["id"]

    # Fetch detail
    get_res = client.get(f"/api/events/{event_id}")
    assert get_res.status_code == 200
    detail = get_res.json()
    assert detail["id"] == event_id
    assert "budgets" in detail
    assert "vendors" in detail

def test_add_and_update_vendor():
    # Use existing seeded event
    events = client.get("/api/events").json()
    event_id = events[0]["id"]

    vendor_payload = {
        "name": "EcoBeats Solar Sound",
        "category": "Music",
        "estimated_cost": 1200.0,
        "actual_cost": 1150.0,
        "is_eco_friendly": True,
        "status": "pending",
        "notes": "Low power stage setup"
    }
    res = client.post(f"/api/events/{event_id}/vendors", json=vendor_payload)
    assert res.status_code == 201
    vendor = res.json()
    assert vendor["name"] == "EcoBeats Solar Sound"
    vendor_id = vendor["id"]

    # Patch status
    patch_res = client.patch(f"/api/vendors/{vendor_id}", json={"status": "contracted"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "contracted"
