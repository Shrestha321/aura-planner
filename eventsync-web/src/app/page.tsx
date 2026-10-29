"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Launchpad, TemplatePreset } from "@/components/Launchpad";
import { AtmosphereEngine } from "@/components/AtmosphereEngine";
import { AuraCommandCenter } from "@/components/AuraCommandCenter";
import { PlanGenerationResponse } from "@/services/api";
import { useLocale } from "@/context/LocaleContext";

// Fallback initial plan so Command Center can be inspected immediately
const DEFAULT_INITIAL_PLAN: PlanGenerationResponse = {
  event_type: "wedding",
  total_budget: 28000,
  title_suggestion: "Architectural Botanical & Candlelit Courtyard Nuptial",
  sustainability: {
    score: 94,
    summary:
      "Closed-loop zero-waste floral architecture utilizing living potted citrus & olive trees, solar battery soundscapes, and certified bio-dynamic vineyard dining.",
    key_recommendations: [
      "Digitize all seating charts & RSVP credentials via interactive QR stations",
      "Partner with a certified food recovery pantry to rescue untouched catered items",
      "Utilize battery generators charged by daytime solar arrays for evening stage lighting",
    ],
  },
  timeline: [
    {
      time: "13:00 - 14:00",
      activity: "Acoustic Load-In & Solar Array Interconnect",
      description: "Sound engineers synchronize mobile solar battery packs with lawn acoustic zone.",
      eco_tip: "Zero idling vehicles permitted during equipment deployment.",
    },
    {
      time: "14:00 - 15:30",
      activity: "Guest Arrival & Botanical Infusion Reception",
      description: "Arrival cocktail hour with chilled organic botanical shrubs and local cider.",
      eco_tip: "Sanitized reusable chilled glassware only; zero single-use plastic cocktail picks.",
    },
    {
      time: "15:30 - 16:45",
      activity: "Courtyard Ceremony & Live Acoustic Strings",
      description: "Vow exchange flanked by living potted olive trees under natural sunlit arbor.",
      eco_tip: "Maximized natural daylight illumination eliminates auxiliary daylight halogen rigs.",
    },
    {
      time: "16:45 - 19:30",
      activity: "Farm-to-Fork Vineyard Banquet",
      description: "Family-style seasonal harvest tasting sourced 100% within 40 miles.",
      eco_tip: "All organic scraps routed to local municipal compost digester post-service.",
    },
    {
      time: "19:30 - 22:30",
      activity: "Twilight Glow & Kinetic Dance Session",
      description: "Low-voltage warm LED lantern canopy with off-grid audio amplification.",
      eco_tip: "All lighting equipment powered exclusively by lithium iron phosphate storage.",
    },
  ],
  vendor_ideas: [
    {
      name: "Soil & Sprout Live Plantscapes",
      category: "Decor",
      estimated_cost: 3800,
      is_eco_friendly: true,
      unique_pitch:
        "Rent mature living olive trees and potted flowering shrubs that are replanted post-event instead of cut flowers.",
    },
    {
      name: "Micro-Harvest Table Collective",
      category: "Catering",
      estimated_cost: 9500,
      is_eco_friendly: true,
      unique_pitch:
        "Zero-waste gourmet tasting menu featuring 100% regional heirloom produce and edible floral garnishes.",
    },
    {
      name: "SunBeat Acoustic & Solar Audio",
      category: "Music",
      estimated_cost: 2600,
      is_eco_friendly: true,
      unique_pitch:
        "Mobile concert sound rig powered entirely by off-grid lithium iron phosphate batteries recharged by solar canopies.",
    },
  ],
  estimated_budget_breakdown: {
    "Venue & Solarium": 7500,
    "Farm-to-Table Gastronomy": 9500,
    "Living Botanical Decor": 3800,
    "Solar Audio Rig": 2600,
    "Contingency Reserve": 4600,
  },
};

export default function Home() {
  const { t } = useLocale();

  const [activeTab, setActiveTab] = useState<"launchpad" | "engine" | "command">("launchpad");
  const [activePreset, setActivePreset] = useState<TemplatePreset | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanGenerationResponse>(DEFAULT_INITIAL_PLAN);
  const [currentMeta, setCurrentMeta] = useState<any>({
    date: "2026-11-20",
    location: "Solarium Glasshouse Pavilion",
    guestCount: 140,
    priorities: ["Gourmet Gastronomy", "Flawless Spatial Decor", "Low Carbon Footprint"],
    directives: ["Vegetarian", "Step-Free / ADA"],
  });

  const handleSelectTemplate = (preset: TemplatePreset) => {
    setActivePreset(preset);
    setActiveTab("engine");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenCustomEngine = () => {
    setActivePreset(null);
    setActiveTab("engine");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlanSynthesized = (plan: PlanGenerationResponse, meta: any) => {
    setCurrentPlan(plan);
    setCurrentMeta(meta);
    setActiveTab("command");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
      {/* Skip Navigation for WCAG 2.1 AA Compliance */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-sm focus:font-black focus:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Midnight Glass Navbar */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* TAB 1: THE LAUNCHPAD */}
          {activeTab === "launchpad" && (
            <Launchpad
              onSelectTemplate={handleSelectTemplate}
              onOpenCustomEngine={handleOpenCustomEngine}
            />
          )}

          {/* TAB 2: THE ATMOSPHERE ENGINE */}
          {activeTab === "engine" && (
            <div className="mx-auto max-w-4xl">
              <AtmosphereEngine
                initialPreset={activePreset}
                onPlanSynthesized={handlePlanSynthesized}
              />
            </div>
          )}

          {/* TAB 3: THE AURA COMMAND CENTER */}
          {activeTab === "command" && (
            <AuraCommandCenter
              plan={currentPlan}
              metadata={currentMeta}
              activeEventId="00000000-0000-0000-0000-000000000001"
              onPlanUpdated={(updated) => setCurrentPlan(updated)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950/80 py-6 text-center text-xs font-mono text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p>
            Aura &copy; 2026 • Autonomous Event Architecture Engine • WCAG 2.1 AA Certified Contrast
          </p>
        </div>
      </footer>
    </div>
  );
}
