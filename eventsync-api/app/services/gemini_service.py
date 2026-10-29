import json
import logging
import os
import re
from typing import Dict, Any, List, Optional
from app.config import settings

logger = logging.getLogger("eventsync.gemini")

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        self.client = None
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Initialized Google GenAI SDK client.")
            except Exception as e:
                logger.warning(f"Failed to initialize google.genai Client: {e}")

    def _clean_json_response(self, text: str) -> str:
        """Strip markdown code block wrappers if present."""
        text = text.strip()
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if match:
            return match.group(1).strip()
        return text

    async def generate_plan(
        self,
        event_type: str,
        total_budget: float,
        guest_count: int = 50,
        constraints: str = "",
        theme: str = "",
        date: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate structured event plan using Gemini API SDK.
        Returns hourly timeline, 3 out-of-the-box vendor ideas, and a sustainability score out of 100.
        """
        prompt = f"""
You are EventSync AI, an elite sustainable event strategist.
Generate a comprehensive, innovative, and eco-friendly event plan for:
- Event Type: {event_type}
- Total Budget: ${total_budget:,.2f} USD
- Expected Guests: {guest_count}
- Constraints & Preferences: {constraints or 'None specified'}
- Theme: {theme or 'Modern Sustainable Elegance'}
- Target Date: {date or 'Upcoming season'}

You MUST return STRICT, VALID JSON ONLY (no markdown text, no explanation outside the JSON).
The JSON must adhere precisely to this schema:
{{
  "title_suggestion": "Inspiring event title",
  "sustainability": {{
    "score": 92,
    "summary": "Detailed explanation of the sustainability score (0-100) based on carbon footprint, zero-waste practices, and ethical sourcing.",
    "key_recommendations": [
      "Specific actionable recommendation 1",
      "Specific actionable recommendation 2",
      "Specific actionable recommendation 3"
    ]
  }},
  "timeline": [
    {{
      "time": "14:00 - 15:00",
      "activity": "Activity Name",
      "description": "Clear description of what happens",
      "eco_tip": "Specific eco-friendly consideration for this hour"
    }}
  ],
  "vendor_ideas": [
    {{
      "name": "Creative Vendor Name",
      "category": "Catering / Decor / Music / Photography / Venue",
      "estimated_cost": 1500.0,
      "is_eco_friendly": true,
      "unique_pitch": "Why this out-of-the-box vendor makes the event unforgettable and green"
    }},
    {{
      "name": "Second Vendor Name",
      "category": "Decor",
      "estimated_cost": 1200.0,
      "is_eco_friendly": true,
      "unique_pitch": "Creative pitch"
    }},
    {{
      "name": "Third Vendor Name",
      "category": "Music",
      "estimated_cost": 1000.0,
      "is_eco_friendly": true,
      "unique_pitch": "Creative pitch"
    }}
  ],
  "estimated_budget_breakdown": {{
    "Venue": 3500.0,
    "Catering": 5000.0,
    "Decor": 2000.0,
    "Entertainment": 2500.0,
    "Contingency": 2000.0
  }},
  "copilot_message": "Event architecture synthesized successfully.",
  "instant_action_items": [
    "Lock primary venue contract",
    "Initiate vendor RFPs",
    "Deploy attendee credentials"
  ]
}}
Make sure there are at least 5-6 realistic hourly timeline steps and exactly 3 out-of-the-box vendor ideas.
"""

        if self.client:
            try:
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                if response and response.text:
                    cleaned = self._clean_json_response(response.text)
                    data = json.loads(cleaned)
                    data["event_type"] = event_type
                    data["total_budget"] = float(total_budget)
                    return data
            except Exception as ex:
                logger.error(f"Gemini API call failed, falling back to deterministic generator: {ex}")

        return self._build_fallback_plan(event_type, total_budget, guest_count, constraints, theme)

    async def adjust_plan(
        self,
        current_plan_data: Dict[str, Any],
        user_command: str
    ) -> Dict[str, Any]:
        """
        Adjust existing event plan using Gemini AI acting as a crisis management event planner.
        Ingests current_plan_data, applies user_command, and returns fully updated JSON structure.
        """
        prompt = f"""
You are the Aura Live Copilot, an elite crisis management and tactical event planner.
You must recalibrate an existing event plan based on an urgent operator command.

CURRENT EVENT PLAN DATA:
{json.dumps(current_plan_data, indent=2)}

OPERATOR COMMAND:
"{user_command}"

CRISIS MANAGEMENT MANDATE:
1. Carefully parse the operator command.
2. If weather or rain is mentioned ("rain", "storm", "move indoors"):
   - Reroute all outdoor/lawn activities to covered solarium, glasshouse, or indoor pavilions.
   - Update timeline descriptions and eco tips with indoor acoustics, warm LED lanterns, and covered walkways.
   - Adjust vendor pitches to reflect indoor setup without adding unnecessary costs.
3. If budget changes are requested ("cut the budget by X%", "increase budget by $Y"):
   - Accurately calculate the new total_budget.
   - Scale the category breakdown and vendor ideas proportionally.
4. If dietary, acoustic, or scheduling changes are requested, apply them accurately.
5. Provide a crisp, authoritative `copilot_message` explaining the exact tactical changes made.
6. Provide 3 `instant_action_items` for immediate execution by the event crew.

You MUST return STRICT, VALID JSON ONLY (no markdown text, no explanation outside the JSON):
{{
  "event_type": "...",
  "total_budget": 18000.0,
  "title_suggestion": "...",
  "sustainability": {{
    "score": 94,
    "summary": "...",
    "key_recommendations": [...]
  }},
  "timeline": [
    {{
      "time": "14:00 - 15:00",
      "activity": "...",
      "description": "...",
      "eco_tip": "..."
    }}
  ],
  "vendor_ideas": [
    {{
      "name": "...",
      "category": "...",
      "estimated_cost": 1500.0,
      "is_eco_friendly": true,
      "unique_pitch": "..."
    }}
  ],
  "estimated_budget_breakdown": {{
    "Venue": 4000.0,
    "Catering": 6000.0
  }},
  "copilot_message": "Tactical summary of adjustments executed.",
  "instant_action_items": [
    "Step 1",
    "Step 2",
    "Step 3"
  ]
}}
"""

        if self.client:
            try:
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                if response and response.text:
                    cleaned = self._clean_json_response(response.text)
                    data = json.loads(cleaned)
                    return data
            except Exception as ex:
                logger.error(f"Gemini adjust_plan call failed: {ex}")

        # High-fidelity deterministic crisis management fallback
        return self._build_fallback_adjustment(current_plan_data, user_command)

    async def generate_live_pivot(
        self,
        incident: str,
        event_type: str = "wedding",
        event_title: str = "Garden Celebration",
        affected_areas: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Generate instant operational intelligence pivot for live event changes.
        """
        areas_str = ", ".join(affected_areas) if affected_areas else "Main event grounds"
        prompt = f"""
You are the EventSync Real-Time Operational AI.
A live situation has occurred during the event:
- Event: {event_title} ({event_type})
- Incident: {incident}
- Affected Areas: {areas_str}

Provide an instant mitigation plan in STRICT, VALID JSON ONLY:
{{
  "incident": "{incident}",
  "severity": "HIGH",
  "instant_action_plan": [
    "Immediate step 1 within 5 minutes",
    "Immediate step 2 within 15 minutes",
    "Immediate step 3 within 30 minutes"
  ],
  "timeline_adjustments": [
    {{"original_time": "15:00", "revised_time": "15:30", "adjustment": "Shift cocktail hour under covered atrium"}},
    {{"original_time": "16:00", "revised_time": "16:45", "adjustment": "Accelerate acoustic set while buffet is transitioned"}}
  ],
  "vendor_emergency_alerts": [
    {{"vendor": "Catering", "directive": "Move buffet stations indoors immediately; preserve warm dishes under heat lamps"}},
    {{"vendor": "Sound & Lighting", "directive": "Depower and cover lawn speaker array; route audio to indoor auxiliary monitors"}}
  ],
  "budget_impact": 150.0,
  "sustainability_safeguard": "Ensure no disposable plastic tarps are discarded; utilize reusable water-repellent canvas shelters."
}}
"""
        if self.client:
            try:
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                if response and response.text:
                    cleaned = self._clean_json_response(response.text)
                    return json.loads(cleaned)
            except Exception as ex:
                logger.error(f"Gemini operational pivot call failed: {ex}")

        return self._build_fallback_pivot(incident, event_type, event_title)

    def _build_fallback_plan(
        self,
        event_type: str,
        total_budget: float,
        guest_count: int,
        constraints: str,
        theme: str
    ) -> Dict[str, Any]:
        t_title = f"{theme or 'Eco-Smart'} {event_type.capitalize()} Celebration"
        b_venue = round(total_budget * 0.28, 2)
        b_cater = round(total_budget * 0.36, 2)
        b_decor = round(total_budget * 0.16, 2)
        b_music = round(total_budget * 0.12, 2)
        b_cont = round(total_budget * 0.08, 2)

        return {
            "event_type": event_type,
            "total_budget": total_budget,
            "title_suggestion": t_title,
            "sustainability": {
                "score": 93,
                "summary": f"Targeting {guest_count} guests with closed-loop zero-waste catering, plantable seed favors, and local bio-dynamic beverage pairings.",
                "key_recommendations": [
                    "Digitize all seating charts & RSVP credentials via interactive QR stations",
                    "Partner with a certified food recovery pantry to rescue untouched catered items",
                    "Utilize battery generators charged by daytime solar arrays for evening stage lighting"
                ]
            },
            "timeline": [
                {
                    "time": "13:00 - 14:00",
                    "activity": "Eco-Vendor Setup & Sound Check",
                    "description": "Vendors arrive and setup using reusable crates and zero-plastic packing.",
                    "eco_tip": "Power down all idle electronics until 15 minutes before guest arrival."
                },
                {
                    "time": "14:00 - 15:00",
                    "activity": "Guest Arrival & Botanical Infusion Bar",
                    "description": "Guests are welcomed with local seasonal fruit and herb-infused iced elixirs.",
                    "eco_tip": "Serve exclusively in sanitized chilled mason jars with bamboo stirrers."
                },
                {
                    "time": "15:00 - 16:30",
                    "activity": "Main Ceremony / Keynote Session",
                    "description": "The central event program unfolds on the central sunlit pavilion.",
                    "eco_tip": "Maximize natural daylighting to eliminate auxiliary daytime stage lamps."
                },
                {
                    "time": "16:30 - 18:00",
                    "activity": "Farm-to-Fork Feast & Interactive Tasting",
                    "description": "Seasonal multi-course dining celebrating ingredients sourced within 50 miles.",
                    "eco_tip": "Provide clearly labeled 3-stream waste receptacles: compost, glass/aluminum, clean paper."
                },
                {
                    "time": "18:00 - 20:30",
                    "activity": "Solar-Powered Live Music & Dancing",
                    "description": "Live acoustic rhythm collective powered by mobile solar battery storage.",
                    "eco_tip": "Use beeswax or low-emission LED lanterns for atmospheric dusk glow."
                },
                {
                    "time": "20:30 - 21:00",
                    "activity": "Seed-Bomb Send-Off & Clean Exit",
                    "description": "Guests depart with wildflower seed bomb favors that cultivate pollinator habitats.",
                    "eco_tip": "Zero confetti or synthetic fireworks; celebrate with acoustic bells and lights."
                }
            ],
            "vendor_ideas": [
                {
                    "name": "Soil & Sprout Live Plantscapes",
                    "category": "Decor",
                    "estimated_cost": b_decor,
                    "is_eco_friendly": True,
                    "unique_pitch": "Rent mature living olive trees and potted flowering shrubs that are replanted post-event instead of cut flowers."
                },
                {
                    "name": "Micro-Harvest Table Collective",
                    "category": "Catering",
                    "estimated_cost": b_cater,
                    "is_eco_friendly": True,
                    "unique_pitch": "Zero-waste gourmet tasting menu featuring 100% regional heirloom produce and edible floral garnishes."
                },
                {
                    "name": "SunBeat Acoustic & Solar Audio",
                    "category": "Music",
                    "estimated_cost": b_music,
                    "is_eco_friendly": True,
                    "unique_pitch": "Mobile concert sound rig powered entirely by off-grid lithium iron phosphate batteries recharged by solar canopies."
                }
            ],
            "estimated_budget_breakdown": {
                "Venue & Permitting": b_venue,
                "Farm-to-Table Catering": b_cater,
                "Living Decor & Botanicals": b_decor,
                "Acoustic & Solar Audio": b_music,
                "Zero-Waste Reserve": b_cont
            },
            "copilot_message": "Event architecture synthesized successfully.",
            "instant_action_items": [
                "Lock primary venue contract",
                "Initiate vendor RFPs",
                "Deploy attendee credentials"
            ]
        }

    def _build_fallback_adjustment(
        self,
        current_plan_data: Dict[str, Any],
        user_command: str
    ) -> Dict[str, Any]:
        """Deterministic, intelligent crisis management fallback for live adjustments."""
        cmd_lower = user_command.lower()
        plan = json.loads(json.dumps(current_plan_data)) # deepcopy

        copilot_message = "Aura recalibrated according to command."
        action_items = [
            "Confirm revised parameters with primary coordinator",
            "Update shared vendor run-sheet",
            "Lock new operational reserve envelope"
        ]

        # Case 1: Weather / Rain / Indoor shift
        if any(w in cmd_lower for w in ["rain", "indoor", "weather", "storm", "wet"]):
            plan["title_suggestion"] = f"{plan.get('title_suggestion', 'Event')} (Sheltered Solarium Edition)"
            
            # Recalibrate timeline for indoor venue
            new_timeline = []
            for step in plan.get("timeline", []):
                act = step.get("activity", "")
                desc = step.get("description", "")
                
                # Replace outdoor terms with indoor equivalents
                act_revised = act.replace("Outdoor", "Sheltered").replace("Lawn", "Solarium Atrium").replace("Open-air", "Covered Glasshouse")
                desc_revised = desc.replace("outdoor lawn", "sheltered glasshouse pavilion").replace("lawn", "indoor solarium courtyard")
                
                new_timeline.append({
                    "time": step.get("time", "14:00"),
                    "activity": act_revised,
                    "description": f"{desc_revised} (Relocated indoors to protected solarium).",
                    "eco_tip": "Deploy ambient warm LED battery lanterns and reusable canvas entry runners."
                })
            plan["timeline"] = new_timeline

            # Update vendor ideas for indoor pivot
            if plan.get("vendor_ideas"):
                plan["vendor_ideas"][0]["name"] = "Solarium Botanical Architecture"
                plan["vendor_ideas"][0]["unique_pitch"] = "Reposition potted living trees and arbors into focal indoor solarium backdrop; zero cut flowers."

            copilot_message = "Severe weather protocol executed: All outdoor ceremonies, lounge zones, and dining have been successfully shifted to the sheltered Solarium Glasshouse. Acoustic rig and botanical decor rerouted with zero budget explosion."
            action_items = [
                "Relocate lawn speaker array to indoor acoustic zone B",
                "Deploy non-slip natural jute runners at solarium entrance",
                "Transmit digital weather advisory alert to attendee cohort"
            ]

        # Case 2: Budget reduction or increase
        elif any(w in cmd_lower for w in ["cut", "reduce", "budget", "lower", "decrease", "%"]):
            pct = 10
            pct_match = re.search(r"(\d+)\s*%", user_command)
            if pct_match:
                pct = int(pct_match.group(1))
            
            multiplier = max(0.5, 1.0 - (pct / 100.0))
            old_budget = float(plan.get("total_budget", 20000.0))
            new_budget = round(old_budget * multiplier, 2)
            plan["total_budget"] = new_budget

            # Scale budget breakdown
            if plan.get("estimated_budget_breakdown"):
                new_breakdown = {}
                for k, v in plan["estimated_budget_breakdown"].items():
                    new_breakdown[k] = round(float(v) * multiplier, 2)
                plan["estimated_budget_breakdown"] = new_breakdown

            # Scale vendor costs
            if plan.get("vendor_ideas"):
                for v in plan["vendor_ideas"]:
                    v["estimated_cost"] = round(float(v.get("estimated_cost", 1000.0)) * multiplier, 2)

            copilot_message = f"Budget reduced by {pct}% (new envelope: ${new_budget:,.2f} USD). Vendor commitments and category envelopes have been scaled down proportionally while locking the {plan.get('sustainability', {}).get('score', 94)}/100 sustainability index."
            action_items = [
                f"Transmit revised budget cap (${new_budget:,.2f}) to financial tracker",
                "Re-negotiate tier-2 vendor packages to fit scaled allocations",
                "Audit zero-waste contingency reserve"
            ]

        # Case 3: Dietary or other custom adjustment
        else:
            copilot_message = f"Aura operational parameters calibrated for command: '{user_command}'. Timeline run-sheet and vendor directives synchronized."
            action_items = [
                f"Apply directive: '{user_command[:45]}...'",
                "Sync operational team via digital dispatch",
                "Log parameter change in event ledger"
            ]

        plan["copilot_message"] = copilot_message
        plan["instant_action_items"] = action_items
        return plan

    def _build_fallback_pivot(self, incident: str, event_type: str, event_title: str) -> Dict[str, Any]:
        return {
            "incident": incident,
            "severity": "HIGH",
            "instant_action_plan": [
                "Execute secondary covered pavilion transition protocol immediately.",
                "Deploy rolling canvas partitions and non-slip jute runners along high-traffic guest walkways.",
                "Issue SMS / digital notification to guests announcing sheltered cocktail lounge opening."
            ],
            "timeline_adjustments": [
                {
                    "original_time": "15:00",
                    "revised_time": "15:20",
                    "adjustment": "Transition outdoor welcome mingling into the sheltered covered atrium."
                },
                {
                    "original_time": "16:00",
                    "revised_time": "16:30",
                    "adjustment": "Commence acoustic live set early under ambient warm indoor lighting."
                }
            ],
            "vendor_emergency_alerts": [
                {
                    "vendor": "Catering & Bar",
                    "directive": "Relocate mobile bar carts under the north arcade; verify surge-protected indoor warming units."
                },
                {
                    "vendor": "Sound & Audio",
                    "directive": "Power down exterior speaker stands; transfer audio master to indoor acoustic zone B."
                },
                {
                    "vendor": "Florist & Decor",
                    "directive": "Reposition botanical arbor to the indoor fireplace focal point."
                }
            ],
            "budget_impact": 180.0,
            "sustainability_safeguard": "Use heavy-duty reusable canvas weather curtains instead of disposable PVC plastic sheeting."
        }

gemini_service = GeminiService()
