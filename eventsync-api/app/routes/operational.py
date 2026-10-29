from fastapi import APIRouter, HTTPException, status
from app.models.schemas import LivePivotRequest, LivePivotResponse
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/operational", tags=["Operational Intelligence"])

@router.post("/pivot", response_model=LivePivotResponse)
async def live_event_pivot(payload: LivePivotRequest):
    """
    Mock webhook & real-time operational intelligence endpoint.
    Simulates a live event incident (e.g. weather changes to rain) and returns
    an instantaneous AI mitigation plan, timeline adjustments, vendor directives, and budget impact.
    """
    try:
        response = await gemini_service.generate_live_pivot(
            incident=payload.incident,
            event_type=payload.event_type or "wedding",
            event_title=payload.event_title or "Garden Celebration",
            affected_areas=payload.affected_areas
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing real-time pivot: {str(e)}"
        )
