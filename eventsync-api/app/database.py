import os
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from app.config import settings
from app.models.schemas import EventCreate, EventResponse, VendorCreate, VendorResponse, VendorUpdate, BudgetCreate, BudgetResponse

# In-Memory Database Store with sample seed data for local development & fallback
class InMemoryDatabase:
    def __init__(self):
        self.events: Dict[str, Dict[str, Any]] = {}
        self.vendors: Dict[str, Dict[str, Any]] = {}
        self.budgets: Dict[str, Dict[str, Any]] = {}
        self._seed_default_data()

    def _seed_default_data(self):
        now = datetime.now(timezone.utc)
        
        # Seed Events
        event_1_id = "00000000-0000-0000-0000-000000000001"
        event_2_id = "00000000-0000-0000-0000-000000000002"
        event_3_id = "00000000-0000-0000-0000-000000000003"

        self.events[event_1_id] = {
            "id": event_1_id,
            "title": "Eco-Chic Garden Wedding",
            "event_type": "wedding",
            "date": now.replace(month=(now.month % 12) + 1, day=15),
            "total_budget": 18500.0,
            "sustainability_score": 92,
            "guest_count": 120,
            "location": "Botanical Solarium",
            "constraints": "Zero-single-use plastics, local seasonal flora",
            "created_at": now,
            "updated_at": now
        }

        self.events[event_2_id] = {
            "id": event_2_id,
            "title": "Neon Solar 30th Birthday",
            "event_type": "birthday",
            "date": now.replace(month=(now.month % 12) + 1, day=24),
            "total_budget": 4500.0,
            "sustainability_score": 88,
            "guest_count": 45,
            "location": "Solaris Rooftop Garden",
            "constraints": "Plant-based catering, energy-efficient lighting",
            "created_at": now,
            "updated_at": now
        }

        self.events[event_3_id] = {
            "id": event_3_id,
            "title": "GreenTech Community Fair",
            "event_type": "community",
            "date": now.replace(month=(now.month % 12) + 1, day=28),
            "total_budget": 8000.0,
            "sustainability_score": 96,
            "guest_count": 350,
            "location": "Civic Central Park",
            "constraints": "Composting stations, solar mobile audio setup",
            "created_at": now,
            "updated_at": now
        }

        # Seed Vendors
        v_data = [
            ("Harvest Table Farm-to-Fork", "Catering", 6200.0, 6100.0, True, "contracted", "100% locally sourced organic menu", event_1_id),
            ("Botanica Native Blooms", "Decor", 2800.0, 2750.0, True, "contracted", "Potted live plants & seed paper stationery", event_1_id),
            ("SolarPulse Acoustic Collective", "Music", 1800.0, 1800.0, True, "paid", "Battery storage charged via solar rig", event_1_id),
            ("Lumina Documentary Lens", "Photography", 2400.0, 0.0, True, "contacted", "Digital-only zero carbon footprint kit", event_1_id),
            ("Green Bites Artisan Truck", "Catering", 1800.0, 1750.0, True, "contracted", "Vegan street food", event_2_id),
            ("DJ Solar Flare", "Music", 900.0, 900.0, True, "contracted", "Low-wattage sound rig", event_2_id),
        ]

        for name, cat, est, act, eco, status, notes, ev_id in v_data:
            vid = str(uuid.uuid4())
            self.vendors[vid] = {
                "id": vid,
                "event_id": ev_id,
                "name": name,
                "category": cat,
                "estimated_cost": est,
                "actual_cost": act,
                "is_eco_friendly": eco,
                "status": status,
                "notes": notes,
                "created_at": now,
                "updated_at": now
            }

        # Seed Budgets
        b_data = [
            ("Catering", 6500.0, 6100.0, event_1_id),
            ("Decor", 3000.0, 2750.0, event_1_id),
            ("Music", 2000.0, 1800.0, event_1_id),
            ("Photography", 2500.0, 0.0, event_1_id),
            ("Venue & Permits", 4500.0, 4500.0, event_1_id),
            ("Catering", 2000.0, 1750.0, event_2_id),
            ("Entertainment", 1200.0, 900.0, event_2_id),
            ("Venue", 1300.0, 1250.0, event_2_id),
        ]

        for cat, alloc, spent, ev_id in b_data:
            bid = str(uuid.uuid4())
            self.budgets[bid] = {
                "id": bid,
                "event_id": ev_id,
                "category": cat,
                "allocated_amount": alloc,
                "actual_spent": spent,
                "created_at": now,
                "updated_at": now
            }

    # Event Methods
    def list_events(self) -> List[Dict[str, Any]]:
        return list(self.events.values())

    def get_event(self, event_id: str) -> Optional[Dict[str, Any]]:
        return self.events.get(event_id)

    def create_event(self, data: EventCreate) -> Dict[str, Any]:
        new_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        record = {
            "id": new_id,
            "title": data.title,
            "event_type": data.event_type,
            "date": data.date,
            "total_budget": data.total_budget,
            "sustainability_score": data.sustainability_score,
            "guest_count": data.guest_count or 50,
            "location": data.location or "TBD",
            "constraints": data.constraints or "",
            "created_at": now,
            "updated_at": now
        }
        self.events[new_id] = record

        # Initialize default budget categories
        default_categories = [
            ("Venue & Setup", data.total_budget * 0.25),
            ("Catering & Refreshments", data.total_budget * 0.35),
            ("Decor & Eco-Signage", data.total_budget * 0.15),
            ("Entertainment & Audio", data.total_budget * 0.15),
            ("Contingency & Carbon Offsets", data.total_budget * 0.10),
        ]
        for cat, amount in default_categories:
            bid = str(uuid.uuid4())
            self.budgets[bid] = {
                "id": bid,
                "event_id": new_id,
                "category": cat,
                "allocated_amount": round(amount, 2),
                "actual_spent": 0.0,
                "created_at": now,
                "updated_at": now
            }

        return record

    # Vendor Methods
    def list_vendors(self, event_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if event_id:
            return [v for v in self.vendors.values() if v["event_id"] == event_id]
        return list(self.vendors.values())

    def create_vendor(self, event_id: str, data: VendorCreate) -> Dict[str, Any]:
        new_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        record = {
            "id": new_id,
            "event_id": event_id,
            "name": data.name,
            "category": data.category,
            "estimated_cost": data.estimated_cost,
            "actual_cost": data.actual_cost or 0.0,
            "is_eco_friendly": data.is_eco_friendly,
            "status": data.status or "pending",
            "notes": data.notes or "",
            "created_at": now,
            "updated_at": now
        }
        self.vendors[new_id] = record
        return record

    def update_vendor(self, vendor_id: str, data: VendorUpdate) -> Optional[Dict[str, Any]]:
        if vendor_id not in self.vendors:
            return None
        vendor = self.vendors[vendor_id]
        update_data = data.model_dump(exclude_unset=True)
        for key, val in update_data.items():
            vendor[key] = val
        vendor["updated_at"] = datetime.now(timezone.utc)
        return vendor

    # Budget Methods
    def list_budgets(self, event_id: str) -> List[Dict[str, Any]]:
        return [b for b in self.budgets.values() if b["event_id"] == event_id]

    def create_budget(self, event_id: str, data: BudgetCreate) -> Dict[str, Any]:
        new_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        record = {
            "id": new_id,
            "event_id": event_id,
            "category": data.category,
            "allocated_amount": data.allocated_amount,
            "actual_spent": data.actual_spent or 0.0,
            "created_at": now,
            "updated_at": now
        }
        self.budgets[new_id] = record
        return record

# Global database instance
db = InMemoryDatabase()
