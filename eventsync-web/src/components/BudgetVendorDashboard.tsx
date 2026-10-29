"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import {
  EventItem,
  VendorItem,
  EventDetail,
  fetchEvents,
  fetchEventDetail,
  addVendor,
  updateVendorStatus,
} from "@/services/api";
import {
  Wallet,
  CheckSquare,
  AlertTriangle,
  PlusCircle,
  Leaf,
  DollarSign,
  TrendingUp,
  Tag,
  Check,
} from "lucide-react";

export function BudgetVendorDashboard() {
  const { t } = useLocale();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Vendor Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorCategory, setNewVendorCategory] = useState("Catering");
  const [newVendorCost, setNewVendorCost] = useState(1500);
  const [newVendorEco, setNewVendorEco] = useState(true);

  // Load Events on Mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
      if (data.length > 0) {
        setSelectedEventId(data[0].id);
        await loadEventDetail(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadEventDetail = async (id: string) => {
    try {
      const detail = await fetchEventDetail(id);
      setEventDetail(detail);
    } catch (err) {
      console.error("Failed to load event details:", err);
    }
  };

  const handleSelectEvent = async (id: string) => {
    setSelectedEventId(id);
    await loadEventDetail(id);
  };

  const handleStatusChange = async (vendorId: string, newStatus: string) => {
    try {
      await updateVendorStatus(vendorId, { status: newStatus });
      if (selectedEventId) {
        await loadEventDetail(selectedEventId);
      }
      setStatusMessage(`Vendor updated to ${newStatus}`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update vendor status:", err);
    }
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !newVendorName.trim()) return;

    try {
      await addVendor(selectedEventId, {
        name: newVendorName,
        category: newVendorCategory,
        estimated_cost: Number(newVendorCost),
        actual_cost: 0,
        is_eco_friendly: newVendorEco,
        status: "pending",
      });
      setNewVendorName("");
      setNewVendorCost(1000);
      setShowAddForm(false);
      await loadEventDetail(selectedEventId);
      setStatusMessage("New vendor added successfully.");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error("Failed to add vendor:", err);
    }
  };

  // Calculations
  const totalBudget = eventDetail?.total_budget ?? 0;
  const vendors = eventDetail?.vendors ?? [];
  const totalEstimatedCost = vendors.reduce((sum, v) => sum + (v.estimated_cost || 0), 0);
  const totalActualCost = vendors.reduce((sum, v) => sum + (v.actual_cost || 0), 0);
  const remainingBudget = totalBudget - totalEstimatedCost;
  const budgetUtilizationPercent =
    totalBudget > 0 ? Math.min(Math.round((totalEstimatedCost / totalBudget) * 100), 100) : 0;

  return (
    <section
      aria-labelledby="dashboard-heading"
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header and Event Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <h2
            id="dashboard-heading"
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            {t.dashboardTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.dashboardSubtitle}
          </p>
        </div>

        {events.length > 0 && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="active-event-selector"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t.selectEventLabel}
            </label>
            <select
              id="active-event-selector"
              value={selectedEventId}
              onChange={(e) => handleSelectEvent(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.event_type})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Budget */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{t.totalBudgetCard}</span>
            <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            ${totalBudget.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Base planned envelope
          </div>
        </div>

        {/* Total Allocated (Vendors Estimated) */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{t.allocatedCard}</span>
            <Tag className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          </div>
          <div className="mt-2 text-2xl font-black text-teal-700 dark:text-teal-400">
            ${totalEstimatedCost.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Sum of vendor estimates ({vendors.length} vendors)
          </div>
        </div>

        {/* Actual Disbursed */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{t.actualSpentCard}</span>
            <DollarSign className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            ${totalActualCost.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Cleared vendor payments
          </div>
        </div>

        {/* Variance / Buffer */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{t.varianceCard}</span>
            <TrendingUp
              className={`h-4 w-4 ${remainingBudget >= 0 ? "text-emerald-600" : "text-red-500"}`}
              aria-hidden="true"
            />
          </div>
          <div
            className={`mt-2 text-2xl font-black ${
              remainingBudget >= 0
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            ${remainingBudget.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {remainingBudget >= 0 ? "Under budget reserve" : "Over budget deficit"}
          </div>
        </div>
      </div>

      {/* Visual Budget Progress Bar (WCAG Compliant) */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-800/20">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>{t.budgetAllocationHealth}</span>
          <span>{budgetUtilizationPercent}% Committed</span>
        </div>
        <div
          role="progressbar"
          aria-label={t.budgetProgressAria}
          aria-valuenow={budgetUtilizationPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
        >
          <div
            style={{ width: `${budgetUtilizationPercent}%` }}
            className={`h-full transition-all duration-500 ${
              budgetUtilizationPercent > 95
                ? "bg-red-500"
                : budgetUtilizationPercent > 80
                ? "bg-amber-500"
                : "bg-emerald-600 dark:bg-emerald-500"
            }`}
          />
        </div>
      </div>

      {/* Vendor Management Checklist Table */}
      <section aria-labelledby="vendor-table-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3
            id="vendor-table-heading"
            className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white"
          >
            <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            {t.vendorChecklistTitle} ({vendors.length})
          </h3>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <PlusCircle className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            {t.addVendorButton}
          </button>
        </div>

        {/* Add Vendor Inline Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddVendor}
            className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 dark:border-emerald-800 dark:bg-emerald-950/30"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              New Vendor Registration
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <input
                type="text"
                placeholder="Vendor Name"
                value={newVendorName}
                onChange={(e) => setNewVendorName(e.target.value)}
                required
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <select
                value={newVendorCategory}
                onChange={(e) => setNewVendorCategory(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Catering">Catering</option>
                <option value="Decor">Decor</option>
                <option value="Music">Music</option>
                <option value="Photography">Photography</option>
                <option value="Venue">Venue</option>
                <option value="Logistics">Logistics</option>
              </select>
              <input
                type="number"
                placeholder="Est. Cost"
                value={newVendorCost}
                onChange={(e) => setNewVendorCost(Number(e.target.value))}
                required
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={newVendorEco}
                    onChange={(e) => setNewVendorEco(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Eco-Friendly</span>
                </label>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-500"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Vendor Checklist Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-4 py-3">{t.vendorNameHeader}</th>
                <th scope="col" className="px-4 py-3">{t.categoryHeader}</th>
                <th scope="col" className="px-4 py-3">{t.costHeader}</th>
                <th scope="col" className="px-4 py-3">{t.ecoHeader}</th>
                <th scope="col" className="px-4 py-3">{t.statusHeader}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-xs text-slate-500">
                    No vendors assigned to this event yet. Use the AI Plan Generator or click "+ Add Custom Vendor".
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => {
                  const statusBadgeColors = {
                    pending: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
                    contacted: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
                    contracted: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
                    paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
                    declined: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300",
                  }[vendor.status];

                  return (
                    <tr
                      key={vendor.id}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {vendor.name}
                        {vendor.notes && (
                          <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                            {vendor.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">{vendor.category}</td>
                      <td className="px-4 py-3 text-xs font-mono font-medium">
                        ${vendor.estimated_cost.toLocaleString()}
                        {vendor.actual_cost > 0 && (
                          <span className="text-slate-400"> / ${vendor.actual_cost.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {vendor.is_eco_friendly ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <Leaf className="h-3 w-3" aria-hidden="true" />
                            Eco
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Standard</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <select
                          aria-label={`Status for ${vendor.name}`}
                          value={vendor.status}
                          onChange={(e) => handleStatusChange(vendor.id, e.target.value)}
                          className={`rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${statusBadgeColors}`}
                        >
                          <option value="pending">{t.statusPending}</option>
                          <option value="contacted">{t.statusContacted}</option>
                          <option value="contracted">{t.statusContracted}</option>
                          <option value="paid">{t.statusPaid}</option>
                          <option value="declined">{t.statusDeclined}</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
