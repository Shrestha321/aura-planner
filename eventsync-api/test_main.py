from fastapi.testclient import TestClient
from app.main import app

# Initialize the test client using your FastAPI app
client = TestClient(app)

def test_root_endpoint():
    # Test if the root health check loads correctly
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_health_check_endpoint():
    # Test the /health endpoint
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data