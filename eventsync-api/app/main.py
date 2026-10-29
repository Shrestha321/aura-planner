from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import events, vendors, plan, operational

app = FastAPI(
    title=settings.APP_NAME,
    description="GenAI-powered planning assistant for organizing weddings, birthdays, and community events with sustainability intelligence.",
    version="1.0.0",
)

# Configure Cross-Origin Resource Sharing (CORS) - Secured for Production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://aura-planner-sage.vercel.app",  # Your live Vercel frontend
        "http://localhost:3000",                  # Local development
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(events.router)
app.include_router(vendors.router)
app.include_router(plan.router)
app.include_router(operational.router)

@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "gemini_configured": bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here"),
        "supabase_configured": bool(settings.SUPABASE_URL and settings.SUPABASE_KEY)
    }