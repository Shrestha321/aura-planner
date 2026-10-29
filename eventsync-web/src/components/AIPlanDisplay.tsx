"use client";

import React, { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { PlanGenerationResponse, addVendor } from "@/services/api";
import {
  Award,
  Clock,
  Lightbulb,
  CheckCircle,
  Leaf,
  DollarSign,
  PieChart,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface AIPlanDisplayProps {
  plan: PlanGenerationResponse;
  activeEventId?: string;
  onVendorsImported?: () => void;
}

export function AIPlanDisplay({ plan, activeEventId, onVendorsImported }: AIPlanDisplayProps) {
  const { t } = useLocale();
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const score = plan.sustainability?.score ?? 90;
  const scoreColor =
    score >= 90
      ? "text-emerald-700 bg-emerald-100 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800"
      : score >= 75
      ? "text-teal-700 bg-teal-100 border-teal-300 dark:bg-teal-950/60 dark:text-teal-400 dark:border-teal-800"
      : "text-amber-700 bg-amber-100 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800";

  const handleImportVendors = async () => {
    if (!activeEventId) return;
    setIsImporting(true);
    setImportSuccess(false);

    try {
      for (const vendor of plan.vendor_ideas) {
        await addVendor(activeEventId, {
          name: vendor.name,
          category: vendor.category,
          estimated_cost: vendor.estimated_cost,
          actual_cost: 0,
          is_eco_friendly: vendor.is_eco_friendly,
          status: "pending",
          notes: vendor.unique_pitch,
        });
      }
      setImportSuccess(true);
      if (onVendorsImported) {
        onVendorsImported();
      }
    } catch (err) {
      console.error("Failed to import vendors:", err);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <article
      aria-labelledby="plan-heading"
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t.planTitle}
          </span>
          <h2
            id="plan-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            {plan.title_suggestion || "Tailored Sustainable Event Architecture"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {plan.event_type.toUpperCase()} • Budget: ${plan.total_budget.toLocaleString()} USD
          </p>
        </div>

        {/* Sustainability Score Gauge */}
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm ${scoreColor}`}
          role="region"
          aria-label={t.sustainabilityBadge}
        >
          <Award className="h-8 w-8 shrink-0" aria-hidden="true" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              {t.sustainabilityBadge}
            </div>
            <div className="text-2xl font-black">
              {score} <span className="text-sm font-normal">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability Summary & Directives */}
      <section
        aria-labelledby="sustainability-details"
        className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20"
      >
        <h3
          id="sustainability-details"
          className="flex items-center gap-2 text-base font-bold text-emerald-950 dark:text-emerald-200"
        >
          <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          {t.sustainabilityBadge} Rationale & Protocol
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900 dark:text-emerald-300">
          {plan.sustainability.summary}
        </p>

        {plan.sustainability.key_recommendations?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              {t.keyRecsTitle}
            </h4>
            <ul className="mt-2 space-y-2">
              {plan.sustainability.key_recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-emerald-950 dark:text-emerald-200 font-medium"
                >
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 3 Out-of-the-Box Vendor Ideas */}
      <section aria-labelledby="vendor-ideas-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3
              id="vendor-ideas-heading"
              className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white"
            >
              <Lightbulb className="h-5 w-5 text-amber-500" aria-hidden="true" />
              {t.vendorIdeasTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.outOfTheBoxSubtitle}
            </p>
          </div>

          {activeEventId && (
            <button
              type="button"
              onClick={handleImportVendors}
              disabled={isImporting || importSuccess}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow transition-all hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-60"
            >
              {importSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  <span>{t.importVendorsSuccess}</span>
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  <span>{t.importVendorsButton}</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plan.vendor_ideas.map((vendor, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-emerald-700"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                    {vendor.category}
                  </span>
                  {vendor.is_eco_friendly && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <Leaf className="h-3 w-3" aria-hidden="true" />
                      {t.ecoFriendlyBadge}
                    </span>
                  )}
                </div>

                <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  {vendor.name}
                </h4>

                <div className="mt-2 rounded-lg bg-white p-2.5 text-xs text-slate-700 shadow-sm border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700/60">
                  <span className="font-semibold text-slate-900 dark:text-white">{t.pitchLabel} </span>
                  {vendor.unique_pitch}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-700/60">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t.estimatedCostLabel}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-emerald-400">
                  ${vendor.estimated_cost.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hourly Timeline */}
      <section aria-labelledby="timeline-heading" className="space-y-4 pt-2">
        <h3
          id="timeline-heading"
          className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white"
        >
          <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          {t.timelineTitle}
        </h3>

        <ol className="relative space-y-3 border-l-2 border-emerald-400 pl-4 ml-2 dark:border-emerald-600">
          {plan.timeline.map((step, idx) => (
            <li key={idx} className="relative">
              {/* Dot */}
              <div
                className="absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-600 dark:border-slate-900 dark:bg-emerald-400"
                aria-hidden="true"
              />
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800/80">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {step.time}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {step.activity}
                  </h4>
                </div>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>

                {step.eco_tip && (
                  <div className="mt-2 flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Leaf className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold">{t.ecoTipLabel}:</strong> {step.eco_tip}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Budget Breakdown Summary */}
      {plan.estimated_budget_breakdown && (
        <section aria-labelledby="breakdown-heading" className="border-t border-slate-200 pt-5 dark:border-slate-800">
          <h3
            id="breakdown-heading"
            className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white"
          >
            <PieChart className="h-5 w-5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            {t.budgetBreakdownTitle}
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {Object.entries(plan.estimated_budget_breakdown).map(([category, amount], idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/50"
              >
                <div className="truncate text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {category}
                </div>
                <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  ${Number(amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
