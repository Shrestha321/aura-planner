"use client";

import React, { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { generateAIPlan, PlanGenerationResponse } from "@/services/api";
import { Sparkles, Calendar, DollarSign, Users, Palette, ShieldAlert, Loader2 } from "lucide-react";

interface EventGeneratorFormProps {
  onPlanGenerated: (plan: PlanGenerationResponse) => void;
}

export function EventGeneratorForm({ onPlanGenerated }: EventGeneratorFormProps) {
  const { t } = useLocale();

  const [eventType, setEventType] = useState("wedding");
  const [totalBudget, setTotalBudget] = useState<number>(18000);
  const [date, setDate] = useState("2026-11-20");
  const [guestCount, setGuestCount] = useState<number>(85);
  const [theme, setTheme] = useState("Solar Boho Chic");
  const [constraints, setConstraints] = useState(
    "100% plant-based organic dining, zero single-use plastics, local floral arrangements only"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const plan = await generateAIPlan({
        event_type: eventType,
        total_budget: Number(totalBudget),
        date,
        guest_count: Number(guestCount),
        theme,
        constraints,
      });
      onPlanGenerated(plan);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate event plan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="generator-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h2
            id="generator-heading"
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            {t.formTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.formSubtitle}
          </p>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <ShieldAlert className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Event Category */}
          <div>
            <label
              htmlFor="event-type-select"
              className="block text-sm font-semibold text-slate-900 dark:text-slate-200"
            >
              {t.eventTypeLabel} <span className="text-emerald-600" aria-hidden="true">*</span>
            </label>
            <div className="mt-1.5">
              <select
                id="event-type-select"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="wedding">{t.eventTypeWedding}</option>
                <option value="birthday">{t.eventTypeBirthday}</option>
                <option value="community">{t.eventTypeCommunity}</option>
                <option value="corporate">{t.eventTypeCorporate}</option>
              </select>
            </div>
          </div>

          {/* Event Date */}
          <div>
            <label
              htmlFor="event-date-input"
              className="block text-sm font-semibold text-slate-900 dark:text-slate-200"
            >
              {t.eventDateLabel} <span className="text-emerald-600" aria-hidden="true">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                id="event-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <Calendar className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          {/* Total Budget */}
          <div>
            <label
              htmlFor="total-budget-input"
              className="block text-sm font-semibold text-slate-900 dark:text-slate-200"
            >
              {t.totalBudgetLabel} <span className="text-emerald-600" aria-hidden="true">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 dark:text-slate-400">
                <DollarSign className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="total-budget-input"
                type="number"
                min="500"
                step="250"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Guest Count */}
          <div>
            <label
              htmlFor="guest-count-input"
              className="block text-sm font-semibold text-slate-900 dark:text-slate-200"
            >
              {t.guestCountLabel}
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 dark:text-slate-400">
                <Users className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="guest-count-input"
                type="number"
                min="5"
                max="5000"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Theme / Atmosphere */}
        <div>
          <label
            htmlFor="theme-input"
            className="block text-sm font-semibold text-slate-900 dark:text-slate-200"
          >
            {t.themeLabel}
          </label>
          <div className="relative mt-1.5">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 dark:text-slate-400">
              <Palette className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              id="theme-input"
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder={t.themePlaceholder}
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Constraints */}
        <div>
          <label
            htmlFor="constraints-textarea"
            className="block text-sm font-semibold text-slate-900 dark:text-slate-200"
          >
            {t.constraintsLabel}
          </label>
          <div className="mt-1.5">
            <textarea
              id="constraints-textarea"
              rows={3}
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder={t.constraintsPlaceholder}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                <span>{t.generatingButton}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                <span>{t.generateButton}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
