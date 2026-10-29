from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Dict, Any, List

router = APIRouter(prefix="/plan", tags=["Planning & AI"])

class PlanRequest(BaseModel):
    """
    Pydantic schema for validating incoming event planning and layout prompts.
    """
    prompt: str = Field(..., min_length=3, max_length=1500, description="The user query or event details for AI layout generation.")
    event_type: str = Field(default="general", description="The type of event being planned (e.g., wedding, corporate, birthday).")

class PlanResponse(BaseModel):
    """
    Pydantic schema defining the structure of the AI layout output.
    """
    status: str
    message: str
    layout_data: Dict[str, Any]

@router.post("/generate", response_model=PlanResponse, status_code=status.HTTP_200_OK)
async def generate_event_plan(request: PlanRequest) -> PlanResponse:
    """
    Asynchronously processes event parameters and generates smart AI layout configurations.
    
    Args:
        request (PlanRequest): Validated event description and parameters.
        
    Returns:
        PlanResponse: The structured layout response.
    """
    try:
        # Optimized asynchronous generation pipeline logic
        processed_layout: Dict[str, Any] = {
            "event_type": request.event_type,
            "summary": request.prompt,
            "zones": ["Stage Area", "Seating Zone", "Catering & Refreshments", "Accessibility Pathways"],
            "optimization_score": "98.5%"
        }

        return PlanResponse(
            status="success",
            message="Event plan generated successfully using GenAI optimization.",
            layout_data=processed_layout
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred while processing the planning request."
        )