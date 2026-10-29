"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import { generateAIPlan, PlanGenerationResponse } from "@/services/api";
import { TemplatePreset } from "./Launchpad";
import {
  Cpu,
  Sparkles,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Utensils,
  Music,
  Palette,
  Leaf,
  Volume2,
  Compass,
  Check,
  ShieldAlert,
  Loader2,
} from "lucide-react";

interface AtmosphereEngineProps {
  initialPreset?: TemplatePreset | null;
  onPlanSynthesized: (plan: PlanGenerationResponse, meta: any) => void;
}

export function AtmosphereEngine({ initialPreset, onPlanSynthesized }: AtmosphereEngineProps) {
  const { t } = useLocale();

  // State
  const [eventType, setEventType] = useState("wedding");
  const [theme, setTheme] = useState("Architectural Botanical & Candlelit Courtyard");
  const [date, setDate] = useState("2026-11-20");
  const [location, setLocation] = useState("Botanical Solarium Glasshouse");
  const [guestCount, setGuestCount] = useState<number>(100);
  const [totalBudget, setTotalBudget] = useState<number>(20000);

  // Priority Matrix (up to 3)
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    "Gourmet Gastronomy",
    "Flawless Spatial Decor",
    "Low Carbon Footprint",
  ]);

  // Dietary & Accessibility
  const [selectedDirectives, setSelectedDirectives] = useState<string[]>([
    "Vegetarian",
    "Step-Free / ADA",
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync when template preset is passed
  useEffect(() => {
    if (initialPreset) {
      setEventType(initialPreset.category);
      setTheme(initialPreset.theme);
      setTotalBudget(initialPreset.budget);
      setGuestCount(initialPreset.guests);
      setLocation(initialPreset.location);
      setSelectedPriorities(initialPreset.priorities.slice(0, 3));
      setSelectedDirectives(initialPreset.dietary);
    }
  }, [initialPreset]);

  const priorityOptions = [
    { id: "gourmet", label: t.priorityGourmet, icon: Utensils },
    { id: "entertainment", label: t.priorityEntertainment, icon: Music },
    { id: "decor", label: t.priorityDecor, icon: Palette },
    { id: "eco", label: t.priorityEco, icon: Leaf },
    { id: "sound", label: t.prioritySound, icon: Volume2 },
    { id: "logistics", label: t.priorityLogistics, icon: Compass },
  ];

  const directiveOptions = [
    { id: "veg", label: t.dietVegetarian },
    { id: "vegan", label: t.dietVegan },
    { id: "halal", label: t.dietHalal },
    { id: "wheelchair", label: t.accessWheelchair },
    { id: "sensory", label: t.accessSensory },
    { id: "glutenfree", label: t.accessGlutenFree },
  ];

  const togglePriority = (label: string) => {
    if (selectedPriorities.includes(label)) {
      setSelectedPriorities(selectedPriorities.filter((p) => p !== label));
    } else {
      if (selectedPriorities.length < 3) {
        setSelectedPriorities([...selectedPriorities, label]);
      }
    }
  };

  const toggleDirective = (label: string) => {
    if (selectedDirectives.includes(label)) {
      setSelectedDirectives(selectedDirectives.filter((d) => d !== label));
    } else {
      setSelectedDirectives([...selectedDirectives, label]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const fullConstraints = [
      `Priorities: ${selectedPriorities.join(", ")}`,
      `Accessibility & Dietary: ${selectedDirectives.join(", ")}`,
      `Location: ${location}`,
    ].join(" | ");

    try {
      const plan = await generateAIPlan({
        event_type: eventType,
        total_budget: Number(totalBudget),
        date,
        guest_count: Number(guestCount),
        theme,
        constraints: fullConstraints,
      });

      onPlanSynthesized(plan, {
        date,
        location,
        guestCount,
        priorities: selectedPriorities,
        directives: selectedDirectives,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to engage Aura synthesis engine.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="engine-heading"
      className="space-y-8 rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]">
            <Cpu className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="engine-heading"
              className="text-2xl font-black tracking-tight text-white sm:text-3xl"
            >
              {t.engineTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              {t.engineSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-950/20 px-3.5 py-1.5 text-xs font-mono font-bold text-cyan-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>AURA MODEL ACTIVE</span>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-xs font-semibold text-red-200"
        >
          <ShieldAlert className="h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: THE VIBE CHECK */}
        <fieldset className="space-y-4">
          <legend className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            01 // {t.vibeSectionTitle}
          </legend>

          {/* Archetype Toggle Buttons */}
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              {t.categoryLabel}
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: "wedding", label: "Wedding", desc: "Grand / Nuptial" },
                { id: "birthday", label: "Birthday", desc: "Milestone / Kinetic" },
                { id: "community", label: "Community", desc: "Civic / Festival" },
                { id: "corporate", label: "Corporate", desc: "Summit / Showcase" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setEventType(cat.id)}
                  className={`flex flex-col items-start rounded-xl p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    eventType === cat.id
                      ? "border border-cyan-500 bg-cyan-950/40 text-white shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                      : "border border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-white"
                  }`}
                  aria-pressed={eventType === cat.id}
                >
                  <span className="text-sm font-bold text-white">{cat.label}</span>
                  <span className="text-[10px] font-mono text-neutral-500">{cat.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Atmosphere Input */}
          <div>
            <label
              htmlFor="atmosphere-input"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
            >
              {t.atmosphereLabel}
            </label>
            <input
              id="atmosphere-input"
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder={t.atmospherePlaceholder}
              required
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 text-sm text-white placeholder-neutral-500 shadow-inner focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
        </fieldset>

        {/* SECTION 2: LOGISTICS & TELEMETRY */}
        <fieldset className="space-y-4">
          <legend className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            02 // {t.telemetrySectionTitle}
          </legend>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Date */}
            <div>
              <label
                htmlFor="execution-date"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
              >
                {t.dateLabel}
              </label>
              <div className="relative">
                <input
                  id="execution-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
                <Calendar className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-neutral-500" aria-hidden="true" />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="deployment-location"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
              >
                {t.locationLabel}
              </label>
              <div className="relative">
                <input
                  id="deployment-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Venue, or Area"
                  required
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-9 pr-3.5 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
                <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-neutral-500" aria-hidden="true" />
              </div>
            </div>

            {/* Guest Count */}
            <div>
              <label
                htmlFor="cohort-guests"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
              >
                {t.guestLabel}
              </label>
              <div className="relative">
                <input
                  id="cohort-guests"
                  type="number"
                  min="5"
                  max="10000"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  required
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-9 pr-3.5 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
                <Users className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-neutral-500" aria-hidden="true" />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="envelope-budget"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
              >
                {t.budgetLabel}
              </label>
              <div className="relative">
                <input
                  id="envelope-budget"
                  type="number"
                  min="500"
                  step="500"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  required
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-9 pr-3.5 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
                <DollarSign className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-neutral-500" aria-hidden="true" />
              </div>
            </div>
          </div>
        </fieldset>

        {/* SECTION 3: THE PRIORITY MATRIX */}
        <fieldset className="space-y-4">
          <div className="flex items-center justify-between">
            <legend className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              03 // {t.priorityMatrixTitle}
            </legend>
            <span className="text-xs font-mono text-neutral-400">
              {selectedPriorities.length} / 3 {t.priorityLimitNotice}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {priorityOptions.map((opt) => {
              const isSelected = selectedPriorities.includes(opt.label);
              const IconComp = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => togglePriority(opt.label)}
                  className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                      : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-white"
                  }`}
                  aria-pressed={isSelected}
                >
                  <IconComp className={`h-4 w-4 shrink-0 ${isSelected ? "text-cyan-400" : "text-neutral-500"}`} />
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="ml-auto h-3.5 w-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* SECTION 4: DIETARY & ACCESSIBILITY PARAMETERS */}
        <fieldset className="space-y-4">
          <legend className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            04 // {t.dietaryAccessTitle}
          </legend>

          <div className="flex flex-wrap gap-2">
            {directiveOptions.map((dir) => {
              const isSelected = selectedDirectives.includes(dir.label);
              return (
                <button
                  key={dir.id}
                  type="button"
                  onClick={() => toggleDirective(dir.label)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-500 text-neutral-950 font-bold shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                      : "border-neutral-800 bg-neutral-950/80 text-neutral-400 hover:border-neutral-700 hover:text-white"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span>{dir.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-neutral-950 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-cyan-500 px-8 py-4 text-base font-black uppercase tracking-wider text-neutral-950 shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all hover:bg-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-neutral-950" aria-hidden="true" />
                <span>{t.synthesizingButton}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-neutral-950" aria-hidden="true" />
                <span>{t.synthesizeButton}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
