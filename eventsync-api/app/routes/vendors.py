from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from app.models.schemas import VendorCreate, VendorResponse, VendorUpdate, BudgetCreate, BudgetResponse
from app.database import db

router = APIRouter(prefix="/api", tags=["Vendors & Budgets"])

@router.get("/events/{event_id}/vendors", response_model=List[VendorResponse])
async def get_event_vendors(event_id: str):
    """Retrieve all vendors assigned to a specific event."""
    if not db.get_event(event_id):
        raise HTTPException(status_code=404, detail="Event not found.")
    return db.list_vendors(event_id=event_id)

@router.post("/events/{event_id}/vendors", response_model=VendorResponse, status_code=status.HTTP_201_CREATED)
async def add_vendor_to_event(event_id: str, payload: VendorCreate):
    """Add a new vendor to an event."""
    if not db.get_event(event_id):
        raise HTTPException(status_code=404, detail="Event not found.")
    return db.create_vendor(event_id=event_id, data=payload)

@router.patch("/vendors/{vendor_id}", response_model=VendorResponse)
async def update_vendor_status(vendor_id: str, payload: VendorUpdate):
    """Update vendor status, actual cost, or notes."""
    updated = db.update_vendor(vendor_id=vendor_id, data=payload)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Vendor with id '{vendor_id}' not found.")
    return updated

@router.get("/events/{event_id}/budgets", response_model=List[BudgetResponse])
async def get_event_budgets(event_id: str):
    """Retrieve all budget allocations for an event."""
    if not db.get_event(event_id):
        raise HTTPException(status_code=404, detail="Event not found.")
    return db.list_budgets(event_id=event_id)

@router.post("/events/{event_id}/budgets", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
async def add_budget_category(event_id: str, payload: BudgetCreate):
    """Add a budget category allocation to an event."""
    if not db.get_event(event_id):
        raise HTTPException(status_code=404, detail="Event not found.")
    return db.create_budget(event_id=event_id, data=payload)
