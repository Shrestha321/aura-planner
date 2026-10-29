"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import {
  PlanGenerationResponse,
  VendorItem,
  fetchVendors,
  addVendor,
  updateVendorStatus,
  adjustAIPlan,
} from "@/services/api";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Wallet,
  Users,
  MapPin,
  Leaf,
  PlusCircle,
  Sliders,
  Send,
  Loader2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Check,
  AlertCircle,
  X,
  Radio,
} from "lucide-react";

interface AuraCommandCenterProps {
  plan: PlanGenerationResponse;
  metadata?: {
    date?: string;
    location?: string;
    guestCount?: number;
    priorities?: string[];
    directives?: string[];
  };
  activeEventId?: string;
  onPlanUpdated?: (updatedPlan: PlanGenerationResponse) => void;
}

export function AuraCommandCenter({
  plan,
  metadata,
  activeEventId = "00000000-0000-0000-0000-000000000001",
  onPlanUpdated,
}: AuraCommandCenterProps) {
  const { t } = useLocale();

  // Active Plan State (can be modified in real-time by Copilot adjustments)
  const [activePlan, setActivePlan] = useState<PlanGenerationResponse>(plan);

  useEffect(() => {
    setActivePlan(plan);
  }, [plan]);

  const [activeTab, setActiveTab] = useState<"overview" | "finance" | "vendors" | "copilot">(
    "overview"
  );

  // Dynamic Countdown calculation
  const targetDateStr = metadata?.date || "2026-11-20";
  const [countdownText, setCountdownText] = useState("T-Minus 21 Days");

  useEffect(() => {
    try {
      const target = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const diffDays = Math.max(1, Math.round((target - now) / (1000 * 60 * 60 * 24)));
      setCountdownText(`T-Minus ${diffDays} Days, 08 Hours`);
    } catch {
      setCountdownText("T-Minus 21 Days");
    }
  }, [targetDateStr]);

  // Checklist items
  const [criticalActions, setCriticalActions] = useState([
    { id: 1, text: t.actionPermits, done: true },
    { id: 2, text: t.actionAudio, done: false },
    { id: 3, text: t.actionCatering, done: false },
    { id: 4, text: t.actionRSVP, done: false },
  ]);

  const toggleAction = (id: number) => {
    setCriticalActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  };

  // Vendor state
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorCategory, setNewVendorCategory] = useState("Decor");
  const [newVendorCost, setNewVendorCost] = useState(1800);
  const [newVendorEco, setNewVendorEco] = useState(true);

  // Live Copilot chat & Recalibration State
  const [copilotInput, setCopilotInput] = useState("");
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const [copilotHistory, setCopilotHistory] = useState<Array<{
    sender: "user" | "aura";
    text: string;
    actionPlan?: string[];
  }>>([
    {
      sender: "aura",
      text: "Aura Copilot synchronized. All atmospheric telemetry is locked. How would you like to calibrate the plan?",
    },
  ]);

  // Load vendors for event
  useEffect(() => {
    loadVendors();
  }, [activeEventId]);

  const loadVendors = async () => {
    try {
      setLoadingVendors(true);
      const data = await fetchVendors(activeEventId);
      setVendors(data);
    } catch (err) {
      console.error("Failed to load vendors:", err);
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleStatusChange = async (vendorId: string, newStatus: string) => {
    try {
      await updateVendorStatus(vendorId, { status: newStatus });
      await loadVendors();
    } catch (err) {
      console.error("Failed to update vendor:", err);
    }
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;

    try {
      await addVendor(activeEventId, {
        name: newVendorName,
        category: newVendorCategory,
        estimated_cost: Number(newVendorCost),
        actual_cost: 0,
        is_eco_friendly: newVendorEco,
        status: "pending",
      });
      setNewVendorName("");
      setShowAddVendor(false);
      await loadVendors();
    } catch (err) {
      console.error("Failed to add vendor:", err);
    }
  };

  // Primary Live Copilot Execution Handler
  const handleCopilotSubmit = async (textToSubmit?: string) => {
    const query = (textToSubmit || copilotInput).trim();
    if (!query) return;

    setCopilotInput("");
    setCopilotHistory((prev) => [...prev, { sender: "user", text: query }]);
    setIsRecalibrating(true);
    setErrorToast(null);

    try {
      const updated = await adjustAIPlan(activePlan, query);

      // Immediately update local active plan state and root state
      setActivePlan(updated);
      if (onPlanUpdated) {
        onPlanUpdated(updated);
      }

      // Add response message to chat history
      const responseMsg =
        updated.copilot_message ||
        `Aura successfully recalibrated for: "${query}". Real-time operational adjustments applied.`;

      setCopilotHistory((prev) => [
        ...prev,
        {
          sender: "aura",
          text: responseMsg,
          actionPlan: updated.instant_action_items,
        },
      ]);

      // If new action items returned, augment critical actions checklist
      if (updated.instant_action_items && updated.instant_action_items.length > 0) {
        const newActions = updated.instant_action_items.map((item, idx) => ({
          id: Date.now() + idx,
          text: item,
          done: false,
        }));
        setCriticalActions((prev) => [...newActions, ...prev]);
      }
    } catch (err: any) {
      console.error("Copilot adjustment failed:", err);
      // Graceful error toast as requested in prompt:
      setErrorToast("Aura interference detected. Please try your adjustment again.");
      setTimeout(() => setErrorToast(null), 6000);

      setCopilotHistory((prev) => [
        ...prev,
        {
          sender: "aura",
          text: "Aura interference detected. Please try your adjustment again.",
        },
      ]);
    } finally {
      setIsRecalibrating(false);
    }
  };

  // Calculations for Financial Pulse
  const totalBudget = activePlan.total_budget || 20000;
  const totalVendorEstimated = vendors.reduce((acc, v) => acc + (v.estimated_cost || 0), 0);
  const burnRatePercent = Math.min(Math.round((totalVendorEstimated / totalBudget) * 100), 100);
  const remainingReserve = totalBudget - totalVendorEstimated;

  return (
    <div className="space-y-8 relative">
      {/* ERROR TOAST (Edge-Case Polish) */}
      {errorToast && (
        <aside
          role="alert"
          aria-live="assertive"
          className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-2xl border border-red-500/50 bg-neutral-900/95 p-4 text-xs font-semibold text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.35)] backdrop-blur-xl animate-in slide-in-from-top-2"
        >
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" aria-hidden="true" />
          <span>{errorToast}</span>
          <button
            type="button"
            onClick={() => setErrorToast(null)}
            className="ml-2 rounded-lg p-1 text-neutral-400 hover:text-white"
            aria-label="Dismiss error notification"
          >
            <X className="h-4 w-4" />
          </button>
        </aside>
      )}

      {/* RECALCULATING AURA LOADING BANNER */}
      {isRecalibrating && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between gap-4 rounded-2xl border border-cyan-500/60 bg-cyan-950/40 p-4 text-xs font-mono font-bold text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.3)] backdrop-blur-xl animate-pulse"
        >
          <div className="flex items-center gap-3">
            <Radio className="h-5 w-5 animate-spin text-cyan-400" aria-hidden="true" />
            <span>RECALCULATING AURA TELEMETRY VIA GEMINI 2.5 CRISIS ENGINE...</span>
          </div>
          <span className="hidden sm:inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-[10px] text-cyan-200 border border-cyan-400/30">
            PROCESSING NATURAL LANGUAGE COMMAND
          </span>
        </div>
      )}

      {/* 1. SWEEPING HERO SECTION */}
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 p-6 sm:p-10 shadow-2xl"
      >
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono font-bold tracking-wider text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>{countdownText}</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs font-mono text-neutral-400">
              <span className="text-cyan-400 font-bold">{activePlan.event_type.toUpperCase()}</span>
              <span>// ARCHITECTURE</span>
            </div>
          </div>

          <div>
            <h1
              id="hero-title"
              className="text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              {activePlan.title_suggestion}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed">
              {activePlan.sustainability?.summary || "Tactical event telemetry active."}
            </p>
          </div>

          {/* High-Level Telemetry Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
            {/* Cohort */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500">
                <Users className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span>{t.statGuests}</span>
              </div>
              <div className="mt-1 text-xl font-black text-white">
                {metadata?.guestCount || 100} <span className="text-xs font-normal text-neutral-500">guests</span>
              </div>
            </div>

            {/* Budget */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500">
                <Wallet className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <span>{t.statBudget}</span>
              </div>
              <div className="mt-1 text-xl font-black text-white">
                ${totalBudget.toLocaleString()} <span className="text-xs font-normal text-neutral-500">USD</span>
              </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500">
                <MapPin className="h-4 w-4 text-rose-400" aria-hidden="true" />
                <span>{t.statLocation}</span>
              </div>
              <div className="mt-1 text-sm font-bold text-white truncate">
                {metadata?.location || "Sheltered Solarium Pavilion"}
              </div>
            </div>

            {/* Sustainability Index */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-4 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400">
                <Leaf className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span>{t.statAuraGrade}</span>
              </div>
              <div className="mt-1 text-xl font-black text-cyan-300">
                {activePlan.sustainability?.score ?? 94} <span className="text-xs font-normal text-cyan-400">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SLEEK HORIZONTAL TABS */}
      <nav aria-label="Command Center Navigation">
        <ul className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto">
          {[
            { id: "overview", label: t.tabOverview },
            { id: "finance", label: t.tabFinance },
            { id: "vendors", label: t.tabVendors },
            { id: "copilot", label: t.tabCopilot },
          ].map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  activeTab === tab.id
                    ? "border border-cyan-500/50 bg-cyan-950/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                    : "border border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900 hover:text-white"
                }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: COMMAND OVERVIEW (Orbit Timeline & Critical Action Items) */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* The Orbit Timeline */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-400" aria-hidden="true" />
                {t.orbitTimelineTitle}
              </h2>
              <p className="text-xs text-neutral-400">{t.orbitSubtitle}</p>
            </div>

            <ol className="relative space-y-4 border-l-2 border-cyan-500/40 pl-6 ml-3">
              {activePlan.timeline.map((step, idx) => (
                <li key={idx} className="relative group">
                  {/* Orbit Node Dot */}
                  <div
                    className="absolute -left-[31px] top-2 h-4 w-4 rounded-full border-2 border-neutral-950 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)] group-hover:scale-125 transition-transform"
                    aria-hidden="true"
                  />

                  <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {step.time}
                      </span>
                      <h3 className="text-sm font-bold text-white">
                        {step.activity}
                      </h3>
                    </div>

                    <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                      {step.description}
                    </p>

                    {step.eco_tip && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5 text-[11px] text-emerald-300">
                        <Leaf className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
                        <span>
                          <strong className="font-semibold text-emerald-400">Eco Directive:</strong>{" "}
                          {step.eco_tip}
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Critical Flight Checks / Action Items */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                {t.criticalActionsTitle}
              </h2>
              <p className="text-xs text-neutral-400">Operational readiness protocol</p>
            </div>

            <div className="space-y-2.5 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-xl">
              {criticalActions.map((action) => (
                <div
                  key={action.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleAction(action.id)}
                  onKeyDown={(e) => e.key === "Enter" && toggleAction(action.id)}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs transition-all ${
                    action.done
                      ? "border-emerald-500/30 bg-emerald-950/20 text-neutral-300 line-through opacity-75"
                      : "border-neutral-800 bg-neutral-950/60 text-white hover:border-neutral-700"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      action.done
                        ? "border-emerald-500 bg-emerald-500 text-neutral-950"
                        : "border-neutral-600"
                    }`}
                  >
                    {action.done && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span>{action.text}</span>
                </div>
              ))}
            </div>

            {/* Out-of-the-Box Vendor Ideas Preview */}
            <div className="rounded-2xl border border-cyan-500/20 bg-neutral-900/60 p-5 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Curated Vendor Concepts</span>
              </h3>
              {activePlan.vendor_ideas.slice(0, 2).map((v, i) => (
                <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 text-xs">
                  <div className="flex items-center justify-between text-white font-bold">
                    <span>{v.name}</span>
                    <span className="text-cyan-400">${v.estimated_cost}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-400 line-clamp-2">{v.unique_pitch}</p>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setActiveTab("vendors")}
                className="w-full text-center text-xs font-mono text-cyan-400 hover:underline pt-1"
              >
                Inspect All Vendors in Matrix →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCIAL PULSE */}
      {activeTab === "finance" && (
        <div className="space-y-6">
          {/* Burn Rate Progress Bar */}
          <section
            aria-labelledby="burn-rate-title"
            className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="burn-rate-title" className="text-xl font-bold text-white">
                  {t.burnRateTitle}
                </h2>
                <p className="text-xs text-neutral-400">{t.burnRateDesc}</p>
              </div>
              <div className="font-mono text-2xl font-black text-cyan-300">
                {burnRatePercent}% <span className="text-xs text-neutral-500 font-normal">Utilized</span>
              </div>
            </div>

            <div
              role="progressbar"
              aria-label="Capital burn rate"
              aria-valuenow={burnRatePercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-4 w-full overflow-hidden rounded-full bg-neutral-950 border border-neutral-800 p-0.5"
            >
              <div
                style={{ width: `${burnRatePercent}%` }}
                className={`h-full rounded-full transition-all duration-700 ${
                  burnRatePercent > 90
                    ? "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
                    : burnRatePercent > 75
                    ? "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                    : "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                <span className="text-xs font-mono text-neutral-500">{t.budgetCap}</span>
                <div className="mt-1 text-xl font-black text-white">
                  ${totalBudget.toLocaleString()} USD
                </div>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                <span className="text-xs font-mono text-neutral-500">{t.committed}</span>
                <div className="mt-1 text-xl font-black text-cyan-400">
                  ${totalVendorEstimated.toLocaleString()} USD
                </div>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                <span className="text-xs font-mono text-neutral-500">{t.reserveBuffer}</span>
                <div
                  className={`mt-1 text-xl font-black ${
                    remainingReserve >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  ${remainingReserve.toLocaleString()} USD
                </div>
              </div>
            </div>
          </section>

          {/* Breakdown Table */}
          {activePlan.estimated_budget_breakdown && (
            <section
              aria-labelledby="cost-breakdown-heading"
              className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-xl"
            >
              <h2 id="cost-breakdown-heading" className="text-lg font-bold text-white mb-4">
                {t.costBreakdownTitle}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {Object.entries(activePlan.estimated_budget_breakdown).map(([cat, amt], i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-center"
                  >
                    <div className="text-xs font-mono text-neutral-400 truncate">{cat}</div>
                    <div className="mt-2 text-base font-bold text-white">
                      ${Number(amt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* TAB 3: VENDOR MATRIX */}
      {activeTab === "vendors" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">Operational Vendor Matrix</h2>
            <button
              type="button"
              onClick={() => setShowAddVendor(!showAddVendor)}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/50 bg-cyan-950/40 px-3.5 py-2 text-xs font-mono font-bold text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)] hover:bg-cyan-900/50"
            >
              <PlusCircle className="h-4 w-4 text-cyan-400" />
              <span>Register New Vendor</span>
            </button>
          </div>

          {/* Add Vendor Form */}
          {showAddVendor && (
            <form
              onSubmit={handleAddVendor}
              className="rounded-2xl border border-cyan-500/40 bg-neutral-900 p-5 space-y-4"
            >
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Register Custom Vendor Entity
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <input
                  type="text"
                  placeholder="Entity Name"
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  required
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white"
                />
                <select
                  value={newVendorCategory}
                  onChange={(e) => setNewVendorCategory(e.target.value)}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white"
                >
                  <option value="Catering">Catering</option>
                  <option value="Decor">Decor</option>
                  <option value="Music">Music</option>
                  <option value="Photography">Photography</option>
                  <option value="Venue">Venue</option>
                  <option value="AV & Lighting">AV & Lighting</option>
                </select>
                <input
                  type="number"
                  placeholder="Estimated Cost"
                  value={newVendorCost}
                  onChange={(e) => setNewVendorCost(Number(e.target.value))}
                  required
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                >
                  Commit Vendor
                </button>
              </div>
            </form>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/80">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-950 text-xs font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3.5">Vendor Entity</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Est. Allocation</th>
                  <th className="px-5 py-3.5">Eco Standard</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="px-5 py-4 font-bold text-white">
                      {vendor.name}
                      {vendor.notes && (
                        <div className="text-[11px] font-normal text-neutral-400">{vendor.notes}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono">{vendor.category}</td>
                    <td className="px-5 py-4 text-xs font-mono font-bold text-cyan-400">
                      ${vendor.estimated_cost.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      {vendor.is_eco_friendly ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300">
                          <Leaf className="h-3 w-3 text-emerald-400" />
                          ECO-CERT
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-xs">STANDARD</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <select
                        aria-label={`Status for ${vendor.name}`}
                        value={vendor.status}
                        onChange={(e) => handleStatusChange(vendor.id, e.target.value)}
                        className="rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="pending">PENDING</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="contracted">CONTRACTED</option>
                        <option value="paid">PAID</option>
                        <option value="declined">DECLINED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AI COPILOT */}
      {activeTab === "copilot" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">{t.copilotHeader}</h2>
            </div>

            {/* Conversation log */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {copilotHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-4 text-xs leading-relaxed ${
                    item.sender === "user"
                      ? "ml-12 border border-cyan-500/30 bg-cyan-950/40 text-cyan-200"
                      : "mr-12 border border-neutral-800 bg-neutral-950 text-neutral-300"
                  }`}
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                    {item.sender === "user" ? "OPERATOR INSTRUCTION" : "AURA COPILOT"}
                  </div>
                  <p>{item.text}</p>
                  {item.actionPlan && item.actionPlan.length > 0 && (
                    <ul className="mt-2 space-y-1 list-disc list-inside text-cyan-300">
                      {item.actionPlan.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {isRecalibrating && (
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing crisis recalibration via Gemini...</span>
                </div>
              )}
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => handleCopilotSubmit("It is going to rain, move everything indoors")}
                className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 text-[11px] text-cyan-300 hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all"
              >
                Rain contingency: Move indoors
              </button>
              <button
                type="button"
                onClick={() => handleCopilotSubmit(t.copilotSample1)}
                className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 text-[11px] text-neutral-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
              >
                {t.copilotSample1}
              </button>
              <button
                type="button"
                onClick={() => handleCopilotSubmit(t.copilotSample3)}
                className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 text-[11px] text-neutral-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
              >
                {t.copilotSample3}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. LIVE AI COPILOT FLOATING FOOTER CONSOLE */}
      <aside aria-label="Floating Aura Copilot Console" className="sticky bottom-6 z-30 pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCopilotSubmit();
          }}
          className="mx-auto max-w-4xl"
        >
          <div
            className={`relative flex items-center rounded-2xl border bg-neutral-950/90 p-2 backdrop-blur-2xl transition-all duration-300 ${
              isRecalibrating
                ? "border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.5)]"
                : "border-cyan-500/50 shadow-[0_0_25px_rgba(34,211,238,0.25)]"
            }`}
          >
            <div className="pointer-events-none pl-3 text-cyan-400">
              {isRecalibrating ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              )}
            </div>

            <input
              type="text"
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              placeholder={isRecalibrating ? "Recalculating Aura Telemetry..." : t.copilotPlaceholder}
              aria-label={t.copilotPlaceholder}
              disabled={isRecalibrating}
              className="w-full bg-transparent px-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={isRecalibrating || !copilotInput.trim()}
              aria-label={t.copilotSendAria}
              className="inline-flex h-9 items-center justify-center rounded-xl bg-cyan-500 px-4 text-xs font-bold text-neutral-950 shadow-[0_0_12px_rgba(34,211,238,0.4)] transition hover:bg-cyan-400 disabled:opacity-40"
            >
              {isRecalibrating ? (
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="hidden sm:inline">Pivoting</span>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="hidden sm:inline">Calibrate</span>
                  <Send className="h-3.5 w-3.5" />
                </div>
              )}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
