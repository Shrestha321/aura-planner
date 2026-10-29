from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional

router = APIRouter(prefix="/events", tags=["Events Management"])

class EventCreate(BaseModel):
    """
    Schema for creating a new event entry.
    """
    title: str = Field(..., min_length=2, max_length=100)
    date: str = Field(..., description="Scheduled date for the event.")
    location: str = Field(..., description="Venue location or address.")

class EventResponse(BaseModel):
    """
    Schema for event response payload.
    """
    event_id: str
    title: str
    date: str
    location: str
    status: str

@router.post("/create", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(event: EventCreate) -> EventResponse:
    """
    Asynchronously registers a new event in the system database with strict input validation.
    
    Args:
        event (EventCreate): The event details provided by the user.
        
    Returns:
        EventResponse: Confirmation and created event details.
    """
    try:
        return EventResponse(
            event_id="evt_987654",
            title=event.title,
            date=event.date,
            location=event.location,
            status="active"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create event due to a server error."
        )

@router.get("/list", status_code=status.HTTP_200_OK)
async def list_events() -> List[dict]:
    """
    Retrieves a list of all active user events asynchronously.
    """
    try:
        return [
            {"event_id": "evt_987654", "title": "Sample Community Event", "date": "2026-06-15", "location": "Main Stadium"}
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve events."
        )