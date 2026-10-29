"""
Root entrypoint proxy for EventSync API.
Enables running `uvicorn main:app` directly from the `eventsync-api` root.
"""
from app.main import app

__all__ = ["app"]
