"use client";

import React from "react";
import { useLocale } from "@/context/LocaleContext";
import { Zap, Crown, Leaf, Sliders, ArrowUpRight, Sparkles } from "lucide-react";

export interface TemplatePreset {
  id: string;
  category: string;
  theme: string;
  budget: number;
  guests: number;
  location: string;
  priorities: string[];
  dietary: string[];
  constraints: string;
}

interface LaunchpadProps {
  onSelectTemplate: (preset: TemplatePreset) => void;
  onOpenCustomEngine: () => void;
}

export function Launchpad({ onSelectTemplate, onOpenCustomEngine }: LaunchpadProps) {
  const { t } = useLocale();

  const templates = [
    {
      id: "cyber-birthday",
      title: t.templateBirthdayTitle,
      desc: t.templateBirthdayDesc,
      icon: Zap,
      gradient: "from-cyan-500/20 via-sky-500/10 to-transparent",
      accent: "text-cyan-400 border-cyan-500/30",
      preset: {
        id: "cyber-birthday",
        category: "birthday",
        theme: "Cyberpunk Neon & Retro-Futurism",
        budget: 6500,
        guests: 60,
        location: "Underground Neon Atrium",
        priorities: ["High-Energy Entertainment", "Immersive Soundscape", "Flawless Spatial Decor"],
        dietary: ["Vegetarian", "Sensory-Quiet Zone"],
        constraints: "Laser mapping arrays, zero-waste synthetic glow favors, local craft beverages",
      },
    },
    {
      id: "heritage-wedding",
      title: t.templateWeddingTitle,
      desc: t.templateWeddingDesc,
      icon: Crown,
      gradient: "from-amber-500/20 via-rose-500/10 to-transparent",
      accent: "text-amber-400 border-amber-500/30",
      preset: {
        id: "heritage-wedding",
        category: "wedding",
        theme: "Architectural Botanical & Candlelit Courtyard",
        budget: 28000,
        guests: 140,
        location: "Solarium Glasshouse",
        priorities: ["Gourmet Gastronomy", "Flawless Spatial Decor", "Frictionless Logistics"],
        dietary: ["Vegetarian", "Step-Free / ADA", "Halal Certified"],
        constraints: "Potted heirloom plants only (no cut flowers), organic estate dining, acoustic solar audio",
      },
    },
    {
      id: "eco-fair",
      title: t.templateEcoTitle,
      desc: t.templateEcoDesc,
      icon: Leaf,
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      accent: "text-emerald-400 border-emerald-500/30",
      preset: {
        id: "eco-fair",
        category: "community",
        theme: "Circular Zero-Waste Bio-Fair",
        budget: 12000,
        guests: 450,
        location: "Civic Eco-Commons Park",
        priorities: ["Low Carbon Footprint", "Gourmet Gastronomy", "Immersive Soundscape"],
        dietary: ["100% Vegan", "Step-Free / ADA", "Sensory-Quiet Zone"],
        constraints: "Composting stations, solar battery generators, seed paper digital badges",
      },
    },
    {
      id: "custom-aura",
      title: t.templateCustomTitle,
      desc: t.templateCustomDesc,
      icon: Sliders,
      gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
      accent: "text-purple-400 border-purple-500/30",
      preset: {
        id: "custom-aura",
        category: "corporate",
        theme: "Futuristic Kinetic Summit",
        budget: 18000,
        guests: 100,
        location: "Skyline Innovation Hall",
        priorities: ["Frictionless Logistics", "Gourmet Gastronomy", "Low Carbon Footprint"],
        dietary: ["Step-Free / ADA", "Vegetarian"],
        constraints: "High-speed interactive AV, sustainable closed-loop catering",
      },
    },
  ];

  return (
    <section aria-labelledby="launchpad-heading" className="space-y-8 py-6">
      {/* Hero Title Section */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-900/60 to-neutral-950 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono font-semibold text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>GEMINI 2.5 EVENT ORCHESTRATION ENGINE</span>
          </div>

          <h1
            id="launchpad-heading"
            className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {t.launchHeader}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
            {t.launchSubheader}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenCustomEngine}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-bold text-neutral-950 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all hover:bg-cyan-400 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span>{t.launchCustomButton}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 4 Aesthetic Templates */}
      <div>
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-4">
          ARCHETYPAL ATMOSPHERES
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((tpl) => {
            const IconComponent = tpl.icon;
            return (
              <div
                key={tpl.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectTemplate(tpl.preset)}
                onKeyDown={(e) => e.key === "Enter" && onSelectTemplate(tpl.preset)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400`}
              >
                {/* Ambient glow accent */}
                <div
                  className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${tpl.gradient} blur-xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60`}
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border bg-neutral-950/80 ${tpl.accent}`}
                    >
                      <IconComponent className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <ArrowUpRight
                      className="h-5 w-5 text-neutral-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-400"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {tpl.title}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                      {tpl.desc}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-neutral-800/80 pt-3 text-[11px] font-mono text-neutral-400">
                  <span>${tpl.preset.budget.toLocaleString()} USD</span>
                  <span className="text-cyan-400 font-semibold group-hover:underline">
                    Load Telemetry →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
