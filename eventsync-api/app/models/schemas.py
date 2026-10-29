from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# -----------------------------------------------------------------------------
# Event Schemas
# -----------------------------------------------------------------------------
class EventBase(BaseModel):
    title: str = Field(..., json_schema_extra={"example": "Eco-Chic Garden Wedding"})
    event_type: str = Field(..., json_schema_extra={"example": "wedding"})
    date: datetime = Field(..., json_schema_extra={"example": "2026-11-20T14:00:00Z"})
    total_budget: float = Field(..., ge=0, json_schema_extra={"example": 18500.0})
    sustainability_score: int = Field(default=85, ge=0, le=100, json_schema_extra={"example": 92})
    guest_count: Optional[int] = Field(default=50, ge=1, json_schema_extra={"example": 100})
    location: Optional[str] = Field(default="TBD", json_schema_extra={"example": "Botanical Solarium"})
    constraints: Optional[str] = Field(default="", json_schema_extra={"example": "Zero-single-use plastics, local seasonal flora"})

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# -----------------------------------------------------------------------------
# Vendor Schemas
# -----------------------------------------------------------------------------
class VendorBase(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Harvest Table Farm-to-Fork"})
    category: str = Field(..., json_schema_extra={"example": "Catering"})
    estimated_cost: float = Field(..., ge=0, json_schema_extra={"example": 6200.0})
    actual_cost: Optional[float] = Field(default=0.0, ge=0, json_schema_extra={"example": 6100.0})
    is_eco_friendly: bool = Field(default=True, json_schema_extra={"example": True})
    status: str = Field(default="pending", json_schema_extra={"example": "contracted"})
    notes: Optional[str] = Field(default="", json_schema_extra={"example": "100% locally sourced organic menu"})

class VendorCreate(VendorBase):
    event_id: Optional[str] = None

class VendorUpdate(BaseModel):
    status: Optional[str] = None
    actual_cost: Optional[float] = None
    notes: Optional[str] = None
    is_eco_friendly: Optional[bool] = None

class VendorResponse(VendorBase):
    id: str
    event_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# -----------------------------------------------------------------------------
# Budget Schemas
# -----------------------------------------------------------------------------
class BudgetBase(BaseModel):
    category: str = Field(..., json_schema_extra={"example": "Catering"})
    allocated_amount: float = Field(..., ge=0, json_schema_extra={"example": 6500.0})
    actual_spent: float = Field(default=0.0, ge=0, json_schema_extra={"example": 6100.0})

class BudgetCreate(BudgetBase):
    event_id: Optional[str] = None

class BudgetResponse(BudgetBase):
    id: str
    event_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# -----------------------------------------------------------------------------
# Full Event Details (Aggregate)
# -----------------------------------------------------------------------------
class EventDetailResponse(EventResponse):
    vendors: List[VendorResponse] = []
    budgets: List[BudgetResponse] = []

# -----------------------------------------------------------------------------
# Gemini AI Plan Generation Schemas
# -----------------------------------------------------------------------------
class TimelineItem(BaseModel):
    time: str = Field(..., json_schema_extra={"example": "14:00 - 15:00"})
    activity: str = Field(..., json_schema_extra={"example": "Arrival & Solar-Chilled Herbal Welcome"})
    description: str = Field(..., json_schema_extra={"example": "Guests arrive and are greeted with seasonal mocktails."})
    eco_tip: Optional[str] = Field(default="", json_schema_extra={"example": "Serve drinks in reusable locally crafted glassware."})

class VendorIdea(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "The Living Table Decor"})
    category: str = Field(..., json_schema_extra={"example": "Decor"})
    estimated_cost: float = Field(..., json_schema_extra={"example": 1200.0})
    is_eco_friendly: bool = Field(default=True, json_schema_extra={"example": True})
    unique_pitch: str = Field(..., json_schema_extra={"example": "Rent potted living bonsai and heirloom trees instead of cut single-use flowers."})

class SustainabilityDetails(BaseModel):
    score: int = Field(..., ge=0, le=100, json_schema_extra={"example": 94})
    summary: str = Field(..., json_schema_extra={"example": "High score achieved through plant-based menus, zero plastic, and renewable battery energy."})
    key_recommendations: List[str] = Field(
        default=[],
        json_schema_extra={"example": ["Use digital invites", "Compost all organic waste", "Contract carbon-neutral transit shuttle"]}
    )

class GeneratePlanRequest(BaseModel):
    event_type: str = Field(..., json_schema_extra={"example": "wedding"})
    total_budget: float = Field(..., ge=0, json_schema_extra={"example": 15000.0})
    date: Optional[str] = Field(default=None, json_schema_extra={"example": "2026-11-20"})
    guest_count: Optional[int] = Field(default=80, json_schema_extra={"example": 80})
    constraints: Optional[str] = Field(default="", json_schema_extra={"example": "Outdoor garden, zero waste, vegan options"})
    theme: Optional[str] = Field(default="", json_schema_extra={"example": "Boho Eco-Elegance"})

class GeneratePlanResponse(BaseModel):
    event_type: str
    total_budget: float
    title_suggestion: str
    sustainability: SustainabilityDetails
    timeline: List[TimelineItem]
    vendor_ideas: List[VendorIdea]
    estimated_budget_breakdown: Dict[str, float]
    copilot_message: Optional[str] = "Event architecture synthesized successfully."
    instant_action_items: Optional[List[str]] = []

# -----------------------------------------------------------------------------
# Live Copilot Adjust Plan Schemas (Phase 6)
# -----------------------------------------------------------------------------
class AdjustPlanRequest(BaseModel):
    current_plan_data: Dict[str, Any] = Field(..., description="The current event plan structure")
    user_command: str = Field(..., json_schema_extra={"example": "It is going to rain, move everything indoors"})

class AdjustPlanResponse(GeneratePlanResponse):
    pass

# -----------------------------------------------------------------------------
# Operational Intelligence / Live Pivot Schemas
# -----------------------------------------------------------------------------
class LivePivotRequest(BaseModel):
    event_id: Optional[str] = None
    event_title: Optional[str] = "Garden Celebration"
    event_type: Optional[str] = "wedding"
    incident: str = Field(..., json_schema_extra={"example": "Sudden torrential rainstorm detected at outdoor venue 2 hours prior to start"})
    affected_areas: Optional[List[str]] = ["Outdoor lawn ceremony", "Open-air buffet"]

class LivePivotResponse(BaseModel):
    incident: str
    severity: str = Field(..., json_schema_extra={"example": "HIGH"})
    instant_action_plan: List[str]
    timeline_adjustments: List[Dict[str, str]]
    vendor_emergency_alerts: List[Dict[str, str]]
    budget_impact: float = 0.0
    sustainability_safeguard: str
