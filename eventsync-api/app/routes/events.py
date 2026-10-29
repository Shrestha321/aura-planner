from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models.schemas import EventCreate, EventResponse, EventDetailResponse, VendorResponse, BudgetResponse
from app.database import db

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.get("", response_model=List[EventResponse])
async def get_all_events():
    """Retrieve all planned events."""
    return db.list_events()

@router.get("/{event_id}", response_model=EventDetailResponse)
async def get_event_by_id(event_id: str):
    """Retrieve a single event with its associated vendors and budget allocations."""
    event = db.get_event(event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id '{event_id}' was not found."
        )
    vendors = db.list_vendors(event_id=event_id)
    budgets = db.list_budgets(event_id=event_id)
    
    return {
        **event,
        "vendors": vendors,
        "budgets": budgets
    }

@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_new_event(payload: EventCreate):
    """Create a new event and initialize budget allocations."""
    return db.create_event(payload)
