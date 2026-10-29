# Aura | The Intelligent Event Command Center

> **The Pitch:** Aura re-architects event planning from a tedious spreadsheet into an autonomous, real-time AI command center. Powered by Google Gemini 2.5, Aura transforms atmospheric sensory vibes, spatial constraints, and financial envelopes into synchronized run-sheets, dynamic burn rates, and instant tactical contingency pivots.

---

## ⚡ Core Innovations

### 1. The "Atmosphere Engine" (AI Synthesis)
Forget generic checklist forms. The Atmosphere Engine acts as an AI configuration console:
- **The Vibe Check**: Select experience archetypes (*Wedding*, *Birthday*, *Community*, *Corporate*) and define rich sensory vibes (*"cyberpunk neon"*, *"architectural botanical"*).
- **Spatial Telemetry**: Precise grid parameters for execution date, deployment zone, guest cohort, and total capital envelope.
- **The Priority Matrix**: Interactive pills allowing users to select up to 3 core focal points (*Gourmet Gastronomy*, *High-Energy Entertainment*, *Flawless Spatial Decor*, *Low Carbon Footprint*, *Immersive Soundscape*, *Frictionless Logistics*).
- **Dietary & Accessibility Directives**: Toggle pills for *Vegetarian*, *100% Vegan*, *Halal Certified*, *Step-Free / ADA*, *Sensory-Quiet Zone*, and *Gluten-Free Only*.

### 2. The "Midnight Glass" UI/UX
- **Aesthetic Depth**: Crafted using an obsidian void palette (`#09090b`), elevated glassmorphic cards (`bg-neutral-900/80 backdrop-blur-xl`), and electric cyan glow accents (`text-cyan-400`, `shadow-[0_0_25px_rgba(34,211,238,0.25)]`).
- **WCAG 2.1 AA Certified**: High-contrast typography (> 7:1 ratio), visible focus rings for keyboard navigation, screen-reader bypass links, and live ARIA progress announcements.
- **Bilingual Support**: Instant, accessible toggle between English (`EN`) and Spanish (`ES`) across all navigation items, telemetry forms, and AI outputs.

### 3. The "Live Copilot" (Real-Time Crisis Management)
The marquee feature of Aura is the persistent, bottom-docked **"Adjust the Aura"** console:
- Type natural language directives like:
  - *"It is going to rain, move everything indoors"*
  - *"Cut the budget by 10%"*
  - *"Add a zero-proof botanical mocktail bar"*
- The Gemini 2.5 crisis engine ingests the current event architecture, applies tactical adjustments, and updates the frontend in real time:
  - **The Orbit Timeline**: Automatically reroutes open lawns/courtyards to sheltered solariums, adjusts times, and updates eco-action directives.
  - **Financial Pulse**: Recalculates capital burn rates, committed vendor funds, and remaining reserve envelopes.
  - **Critical Flight Checks**: Automatically augments the checklist with 3 new operational action items.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS**, **Lucide Icons** |
| **Backend** | **Python 3.12**, **FastAPI**, **Uvicorn**, **Pydantic v2**, **Pytest** |
| **AI Engine** | **Google Gemini 2.5 API** via official `google-genai` SDK |
| **Database** | **Supabase** (PostgreSQL) with UUIDs, Row-Level Security (RLS), and in-memory local fallback |
| **DevOps** | **Docker**, **Docker Compose**, **Vercel Config** (`vercel.json`), **Render Blueprint** (`render.yaml`), **Procfile** |

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js** (v18+ or v20+) and **npm**
- **Python** (3.10+ or 3.12+)
- *(Optional)* **Docker Desktop**

---

### Step 1: Clone & Configure Environment Variables

```bash
# Clone the repository
git clone https://github.com/your-username/aura.git
cd aura
```

#### Backend Environment (`eventsync-api/.env`)
Create `eventsync-api/.env` from the provided example:
```bash
cp eventsync-api/.env.example eventsync-api/.env
```
Populate the keys:
```env
PORT=8000
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]

# Google Gemini API Key (Required for live AI synthesis)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration (Optional: in-memory store activates if empty)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-or-service-key
```

#### Frontend Environment (`eventsync-web/.env.local`)
Create `eventsync-web/.env.local`:
```bash
cp eventsync-web/.env.example eventsync-web/.env.local
```
Contents:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### Step 2: Run the Backend (FastAPI)

```bash
cd eventsync-api

# Create & activate virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run automated tests
pytest tests -v

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

### Step 3: Run the Frontend (Next.js)

In a new terminal:
```bash
cd eventsync-web

# Install dependencies
npm install

# Run the development server
npm run dev
# OR run the optimized production build:
# npm run build && npm run start
```
The Aura Command Center will be live at: **[http://localhost:3000](http://localhost:3000)**

---

### Alternative: Run with Docker Compose

To launch both the API and Web services in isolated containers:
```bash
docker-compose up --build
```

---

## 📡 API Reference Architecture

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/generate-plan` | Ingests archetype, budget, theme, priorities, and returns full event architecture. |
| `POST` | `/api/adjust-plan` | **Live Copilot**: Ingests current plan + natural language command; returns updated plan. |
| `POST` | `/api/operational/pivot` | Simulated webhook for live event disruptions (weather storms, power cuts). |
| `GET` | `/api/events` | Fetches all active events. |
| `GET` | `/api/events/{id}` | Fetches event detail aggregate with related vendors and budget allocations. |
| `POST` | `/api/events/{id}/vendors` | Registers a new vendor entity under an event. |
| `PATCH` | `/api/vendors/{id}` | Updates vendor operational status (`pending`, `contracted`, `paid`, etc.). |
| `GET` | `/health` | Live system health and service status probe. |

---

## 🌐 Production Deployment

### Deploy Backend to Render / Railway
1. **Render**: Connect the repository to [Render](https://render.com).
   - Render automatically detects [`render.yaml`](file:///eventsync-api/render.yaml).
   - Add your `GEMINI_API_KEY` under Environment Variables.
2. **Railway**: Link the `/eventsync-api` directory. The included [`Dockerfile`](file:///eventsync-api/Dockerfile) and [`Procfile`](file:///eventsync-api/Procfile) configure the container automatically.

### Deploy Frontend to Vercel
1. Import the repository into [Vercel](https://vercel.com).
2. Set the **Root Directory** to `eventsync-web`.
3. Add the environment variable:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com
   ```
4. Click **Deploy**. Vercel uses the included [`vercel.json`](file:///eventsync-web/vercel.json) for automatic configuration.

---

## 🎬 2-Minute Demo Video Walkthrough Guide

1. **The Hook (0:00 - 0:25)**:
   - Introduce **Aura**: "Traditional event planning relies on brittle spreadsheets and generic checklists. Aura is an autonomous event command center powered by Google Gemini 2.5."
   - Showcase the **Launchpad**: Click *"Grand Heritage Wedding"* or *"Neon Cyber-Birthday"* to demonstrate template telemetry pre-filling.
2. **The Atmosphere Engine (0:25 - 0:50)**:
   - Highlight the **Vibe Check**, **Priority Matrix** (3-pillar selection cap), and **Accessibility / Dietary** parameters.
   - Click **"Engage Aura Engine"**; show the real-time AI synthesis progress.
3. **The Command Center (0:50 - 1:20)**:
   - Walk through the **Orbit Timeline** (hour-by-hour run-sheet with eco tips).
   - Switch to **Financial Pulse**: Show the **Capital Burn Rate** progress bar and category allocation table.
   - Switch to **Vendor Matrix**: Demonstrate changing vendor operational statuses (`Pending` ➔ `Contracted`).
4. **The Climax: Live Copilot Recalibration (1:20 - 1:55)**:
   - Focus on the floating **"Adjust the Aura"** console.
   - Type: `"It is going to rain, move everything indoors"`.
   - Watch the pulsing cyan banner recalibrate:
     - The event title changes to *"Sheltered Solarium Edition"*.
     - The Orbit Timeline moves all lawn ceremonies to the indoor glasshouse.
     - Critical Flight Checks automatically populate with indoor sound and entrance directives.
   - Show second command: `"Cut the budget by 10%"` ➔ watch the Financial Pulse burn rate recalculate instantly.
5. **Closing (1:55 - 2:00)**:
   - Highlight WCAG 2.1 AA certified contrast and English/Spanish i18n switcher.
   - Conclude: "Aura is event planning elevated to an autonomous operational art."

---

## 📄 License
MIT © 2026 Aura Architecture Team.
