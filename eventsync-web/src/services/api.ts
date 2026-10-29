/**
 * EventSync / Aura API Client Service
 * Connects Next.js Frontend to FastAPI Backend
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

export interface EventItem {
  id: string;
  title: string;
  event_type: string;
  date: string;
  total_budget: number;
  sustainability_score: number;
  guest_count: number;
  location: string;
  constraints: string;
  created_at: string;
  updated_at: string;
}

export interface VendorItem {
  id: string;
  event_id: string;
  name: string;
  category: string;
  estimated_cost: number;
  actual_cost: number;
  is_eco_friendly: boolean;
  status: "pending" | "contacted" | "contracted" | "paid" | "declined";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetItem {
  id: string;
  event_id: string;
  category: string;
  allocated_amount: number;
  actual_spent: number;
  created_at: string;
  updated_at: string;
}

export interface EventDetail extends EventItem {
  vendors: VendorItem[];
  budgets: BudgetItem[];
}

export interface TimelineItem {
  time: string;
  activity: string;
  description: string;
  eco_tip?: string;
}

export interface VendorIdea {
  name: string;
  category: string;
  estimated_cost: number;
  is_eco_friendly: boolean;
  unique_pitch: string;
}

export interface SustainabilityDetails {
  score: number;
  summary: string;
  key_recommendations: string[];
}

export interface PlanGenerationRequest {
  event_type: string;
  total_budget: number;
  date?: string;
  guest_count?: number;
  constraints?: string;
  theme?: string;
}

export interface PlanGenerationResponse {
  event_type: string;
  total_budget: number;
  title_suggestion: string;
  sustainability: SustainabilityDetails;
  timeline: TimelineItem[];
  vendor_ideas: VendorIdea[];
  estimated_budget_breakdown: Record<string, number>;
  copilot_message?: string;
  instant_action_items?: string[];
}

export interface LivePivotRequest {
  event_id?: string;
  event_title?: string;
  event_type?: string;
  incident: string;
  affected_areas?: string[];
}

export interface LivePivotResponse {
  incident: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  instant_action_plan: string[];
  timeline_adjustments: Array<{
    original_time?: string;
    revised_time?: string;
    adjustment: string;
  }>;
  vendor_emergency_alerts: Array<{
    vendor: string;
    directive: string;
  }>;
  budget_impact: number;
  sustainability_safeguard: string;
}

// -----------------------------------------------------------------------------
// Helper Fetch Wrapper
// -----------------------------------------------------------------------------
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = "An unexpected server error occurred.";
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      errorDetail = `HTTP Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

// -----------------------------------------------------------------------------
// API Functions
// -----------------------------------------------------------------------------

export async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/events`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse<EventItem[]>(res);
}

export async function fetchEventDetail(eventId: string): Promise<EventDetail> {
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse<EventDetail>(res);
}

export async function createEvent(
  payload: Omit<EventItem, "id" | "created_at" | "updated_at">
): Promise<EventItem> {
  const res = await fetch(`${API_BASE_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<EventItem>(res);
}

export async function fetchVendors(eventId: string): Promise<VendorItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/vendors`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse<VendorItem[]>(res);
}

export async function addVendor(
  eventId: string,
  payload: {
    name: string;
    category: string;
    estimated_cost: number;
    actual_cost?: number;
    is_eco_friendly: boolean;
    status: string;
    notes?: string;
  }
): Promise<VendorItem> {
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/vendors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<VendorItem>(res);
}

export async function updateVendorStatus(
  vendorId: string,
  updates: {
    status?: string;
    actual_cost?: number;
    notes?: string;
  }
): Promise<VendorItem> {
  const res = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return handleResponse<VendorItem>(res);
}

export async function generateAIPlan(
  payload: PlanGenerationRequest
): Promise<PlanGenerationResponse> {
  const res = await fetch(`${API_BASE_URL}/api/generate-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<PlanGenerationResponse>(res);
}

export async function adjustAIPlan(
  currentPlanData: PlanGenerationResponse,
  userCommand: string
): Promise<PlanGenerationResponse> {
  const res = await fetch(`${API_BASE_URL}/api/adjust-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      current_plan_data: currentPlanData,
      user_command: userCommand,
    }),
  });
  return handleResponse<PlanGenerationResponse>(res);
}

export async function simulateOperationalPivot(
  payload: LivePivotRequest
): Promise<LivePivotResponse> {
  const res = await fetch(`${API_BASE_URL}/api/operational/pivot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<LivePivotResponse>(res);
}
