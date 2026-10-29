from fastapi import APIRouter, HTTPException, status
from app.models.schemas import (
    GeneratePlanRequest,
    GeneratePlanResponse,
    AdjustPlanRequest,
    AdjustPlanResponse,
)
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api", tags=["GenAI Planning & Copilot"])

@router.post("/generate-plan", response_model=GeneratePlanResponse)
async def generate_event_plan(payload: GeneratePlanRequest):
    """
    Generate an AI-powered event blueprint containing:
    1. An hourly timeline
    2. 3 personalized out-of-the-box vendor ideas
    3. A Sustainability Score (out of 100) and eco-friendly recommendations
    """
    try:
        plan = await gemini_service.generate_plan(
            event_type=payload.event_type,
            total_budget=payload.total_budget,
            guest_count=payload.guest_count or 50,
            constraints=payload.constraints or "",
            theme=payload.theme or "",
            date=payload.date,
        )
        return plan
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating AI event plan: {str(e)}"
        )

@router.post("/adjust-plan", response_model=AdjustPlanResponse)
async def adjust_event_plan(payload: AdjustPlanRequest):
    """
    Live Copilot endpoint to dynamically recalibrate an existing event plan based on natural language commands.
    Ingests current_plan_data, applies user_command via Gemini AI crisis management instructions,
    and returns the fully updated JSON structure reflecting the new budget, timeline, and vendor adjustments.
    """
    try:
        updated_plan = await gemini_service.adjust_plan(
            current_plan_data=payload.current_plan_data,
            user_command=payload.user_command,
        )
        return updated_plan
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Aura interference detected during plan adjustment: {str(e)}"
        )
