"use client";

import React, { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { simulateOperationalPivot, LivePivotResponse } from "@/services/api";
import {
  Activity,
  AlertOctagon,
  Clock,
  ShieldCheck,
  Send,
  Loader2,
  BellRing,
  RefreshCw,
} from "lucide-react";

export function OperationalIntelligence() {
  const { t } = useLocale();

  const scenarios = [
    {
      id: "rain",
      label: t.incidentOptionRain,
      value: "Sudden torrential rainstorm detected at outdoor grounds (2h before start)",
    },
    {
      id: "power",
      label: t.incidentOptionPower,
      value: "Main generator blackout in sound and catering pavilion",
    },
    {
      id: "catering",
      label: t.incidentOptionCateringDelay,
      value: "Key farm-to-table organic food transport stranded in traffic",
    },
  ];

  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].value);
  const [customIncident, setCustomIncident] = useState("");
  const [loading, setLoading] = useState(false);
  const [pivotResult, setPivotResult] = useState<LivePivotResponse | null>(null);

  const handleTriggerPivot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const incidentToSubmit = customIncident.trim() || selectedScenario;

    try {
      const result = await simulateOperationalPivot({
        incident: incidentToSubmit,
        event_title: "Garden Celebration",
        event_type: "wedding",
        affected_areas: ["Outdoor lawn ceremony", "Open-air buffet"],
      });
      setPivotResult(result);
    } catch (err) {
      console.error("Failed to execute live pivot:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="ops-heading"
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
          <Activity className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h2
            id="ops-heading"
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            {t.opsTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.opsSubtitle}
          </p>
        </div>
      </div>

      {/* Trigger Form */}
      <form onSubmit={handleTriggerPivot} className="space-y-4">
        <div>
          <label
            htmlFor="scenario-select"
            className="block text-sm font-semibold text-slate-900 dark:text-slate-200"
          >
            {t.simulateIncidentLabel}
          </label>
          <div className="mt-2 space-y-2">
            {scenarios.map((sc) => (
              <label
                key={sc.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-xs font-medium transition-all ${
                  selectedScenario === sc.value && !customIncident
                    ? "border-amber-500 bg-amber-50/70 text-amber-950 dark:border-amber-600 dark:bg-amber-950/30 dark:text-amber-200"
                    : "border-slate-200 bg-slate-50/50 text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="incident-scenario"
                  value={sc.value}
                  checked={selectedScenario === sc.value && !customIncident}
                  onChange={() => {
                    setSelectedScenario(sc.value);
                    setCustomIncident("");
                  }}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                />
                <span>{sc.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div>
          <label
            htmlFor="custom-incident-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-400"
          >
            Or write a custom live incident:
          </label>
          <input
            id="custom-incident-input"
            type="text"
            value={customIncident}
            onChange={(e) => setCustomIncident(e.target.value)}
            placeholder="e.g., Heavy wind gusts damaging outdoor floral pavilion..."
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-60 dark:bg-amber-500 dark:text-slate-950"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>{t.pivotingButton}</span>
            </>
          ) : (
            <>
              <AlertOctagon className="h-4 w-4" aria-hidden="true" />
              <span>{t.triggerPivotButton}</span>
            </>
          )}
        </button>
      </form>

      {/* AI Pivot Results */}
      {pivotResult && (
        <div
          role="region"
          aria-labelledby="pivot-results-title"
          className="mt-6 space-y-5 rounded-xl border border-amber-300 bg-amber-50/50 p-5 dark:border-amber-800/60 dark:bg-amber-950/20"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-3 dark:border-amber-900/50">
            <h3
              id="pivot-results-title"
              className="text-base font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2"
            >
              <RefreshCw className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              AI Real-Time Mitigation Plan
            </h3>
            <span className="rounded-full bg-red-100 px-3 py-0.5 text-xs font-bold text-red-800 border border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800">
              {t.severityLabel} {pivotResult.severity}
            </span>
          </div>

          {/* Instant Action Plan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300">
              {t.instantActionTitle}
            </h4>
            <ol className="mt-2 space-y-2">
              {pivotResult.instant_action_plan.map((action, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[11px] font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                    {i + 1}
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Timeline Adjustments */}
          {pivotResult.timeline_adjustments?.length > 0 && (
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300">
                <Clock className="h-4 w-4 text-amber-600" aria-hidden="true" />
                {t.timelineAdjustmentsTitle}
              </h4>
              <div className="mt-2 space-y-2">
                {pivotResult.timeline_adjustments.map((adj, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-2.5 text-xs shadow-xs border border-amber-200 dark:bg-slate-900 dark:border-slate-800"
                  >
                    <div className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      {adj.original_time} → {adj.revised_time}
                    </div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {adj.adjustment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vendor Directives */}
          {pivotResult.vendor_emergency_alerts?.length > 0 && (
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300">
                <BellRing className="h-4 w-4 text-red-600" aria-hidden="true" />
                {t.vendorAlertsTitle}
              </h4>
              <div className="mt-2 space-y-2">
                {pivotResult.vendor_emergency_alerts.map((alert, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-white p-3 text-xs shadow-xs border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                  >
                    <span className="font-bold text-slate-900 dark:text-white">
                      [{alert.vendor}]:{" "}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {alert.directive}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zero-Waste Sustainability Safeguard */}
          <div className="flex items-start gap-3 rounded-lg bg-emerald-100/70 p-3 text-xs text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            <div>
              <span className="font-bold">{t.safeguardTitle}: </span>
              {pivotResult.sustainability_safeguard}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
