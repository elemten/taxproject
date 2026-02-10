"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  BadgeCheck,
  CalendarClock,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";

type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "closed";
type StatusFilter = LeadStatus | "all";

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  service_interest: string | null;
  created_at: string;
};

type SlotRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  is_active: boolean;
};

type DashboardResponse = {
  stats: {
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    convertedLeads: number;
    activeBookings: number;
  };
  leads: LeadRow[];
};

type StatItem = {
  label: string;
  value: number;
  icon: LucideIcon;
};

const statusBadgeClass: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-emerald-100 text-emerald-700",
  converted: "bg-violet-100 text-violet-700",
  closed: "bg-slate-100 text-slate-700",
};

const statusLabel: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  closed: "Closed",
};

const statusFilters: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All status" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

export function AdminPageClient() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingSlot, setSavingSlot] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState("");
  const [slotForm, setSlotForm] = useState({
    startsAt: "",
    endsAt: "",
    timezone: "America/Regina",
  });

  const refreshData = useCallback(async (manualRefresh = false) => {
    if (manualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [leadsResponse, slotsResponse] = await Promise.all([
        fetch("/api/admin/leads", { cache: "no-store" }),
        fetch("/api/admin/slots", { cache: "no-store" }),
      ]);

      const leadsResult = (await leadsResponse.json().catch(() => null)) as
        | DashboardResponse
        | { error?: string }
        | null;
      const slotsResult = (await slotsResponse.json().catch(() => null)) as
        | { slots: SlotRow[]; error?: string }
        | { error?: string }
        | null;

      if (!leadsResponse.ok) {
        throw new Error(
          (leadsResult as { error?: string } | null)?.error ?? "Failed to load leads",
        );
      }

      if (!slotsResponse.ok) {
        throw new Error(
          (slotsResult as { error?: string } | null)?.error ?? "Failed to load slots",
        );
      }

      setDashboard(leadsResult as DashboardResponse);
      setSlots((slotsResult as { slots: SlotRow[] }).slots ?? []);
      setLastUpdatedLabel(
        new Date().toLocaleTimeString("en-CA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load admin data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  const stats = useMemo<StatItem[]>(() => {
    if (!dashboard) {
      return [];
    }

    return [
      { label: "Total Leads", value: dashboard.stats.totalLeads, icon: Users },
      { label: "New Leads", value: dashboard.stats.newLeads, icon: UserPlus },
      { label: "Qualified", value: dashboard.stats.qualifiedLeads, icon: BadgeCheck },
      { label: "Converted", value: dashboard.stats.convertedLeads, icon: UserCheck },
      { label: "Active Bookings", value: dashboard.stats.activeBookings, icon: CalendarClock },
      {
        label: "Open Slots",
        value: slots.filter((slot) => slot.is_active).length,
        icon: CalendarClock,
      },
    ];
  }, [dashboard, slots]);

  const visibleLeads = useMemo(() => {
    const leads = dashboard?.leads ?? [];
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        lead.name,
        lead.email,
        lead.phone,
        lead.source,
        lead.service_interest ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [dashboard, searchQuery, statusFilter]);

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    setPendingLeadId(leadId);

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "Unable to update status");
      }

      await refreshData();
    } finally {
      setPendingLeadId(null);
    }
  };

  const convertLead = async (leadId: string) => {
    setPendingLeadId(leadId);

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/convert-to-client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "Unable to convert lead");
      }

      await refreshData();
    } finally {
      setPendingLeadId(null);
    }
  };

  const createSlot = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingSlot(true);

    try {
      const response = await fetch("/api/admin/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startsAt: new Date(slotForm.startsAt).toISOString(),
          endsAt: new Date(slotForm.endsAt).toISOString(),
          timezone: slotForm.timezone,
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "Unable to create slot");
      }

      setSlotForm({ startsAt: "", endsAt: "", timezone: slotForm.timezone });
      await refreshData();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create slot");
    } finally {
      setSavingSlot(false);
    }
  };

  return (
    <section className="pb-10 pt-8 sm:pb-14 sm:pt-10">
      <div className="container-page space-y-6">
        <header className="surface-solid border-brand/15 bg-white/95 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <SiteLogo variant="icon" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/70">Internal</p>
                <h1 className="text-xl font-semibold text-brand sm:text-2xl">TrustEdge Admin Workspace</h1>
                <p className="mt-1 text-sm text-muted-foreground">Lead pipeline, booking slots, and conversion flow.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="hidden text-xs text-muted-foreground sm:block">
                Last synced {lastUpdatedLabel || "--:--"}
              </p>
              <button
                type="button"
                onClick={() => void refreshData(true)}
                disabled={refreshing || loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-brand/15 bg-white px-4 text-xs font-semibold text-brand transition-colors hover:bg-brand/[0.05] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {refreshing || loading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                Refresh data
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-brand/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand/65">{stat.label}</p>
                  <stat.icon className="size-4 text-brand/75" />
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-brand">{stat.value}</p>
              </article>
            ))}
          </div>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="surface-solid border-brand/10 bg-white/95">
            <div className="border-b border-brand/10 px-4 py-4 sm:px-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-brand">Lead Pipeline</h2>
                  <p className="text-xs text-muted-foreground">
                    Showing {visibleLeads.length} of {dashboard?.leads.length ?? 0} leads
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search name, email, phone, source"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-10 w-full rounded-full border border-brand/15 bg-white pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus:border-brand/35"
                  />
                </label>
                <label>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                    className="h-10 w-full rounded-full border border-brand/15 bg-white px-3 text-sm text-foreground outline-none transition-colors focus:border-brand/35"
                  >
                    {statusFilters.map((filter) => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 px-6 py-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading leads...
              </div>
            ) : visibleLeads.length === 0 ? (
              <div className="px-6 py-10 text-sm text-muted-foreground">No leads match the current filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[860px] w-full text-left">
                  <thead className="bg-brand/[0.04]">
                    <tr>
                      {["Lead", "Contact", "Source", "Service", "Status", "Created", "Actions"].map((col) => (
                        <th
                          key={col}
                          className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand/80 sm:px-6"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand/10">
                    {visibleLeads.map((lead) => {
                      const isPending = pendingLeadId === lead.id;

                      return (
                        <tr key={lead.id} className="hover:bg-brand/[0.03]">
                          <td className="px-4 py-4 sm:px-6">
                            <p className="text-sm font-semibold text-brand">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.email}</p>
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground sm:px-6">{lead.phone}</td>
                          <td className="px-4 py-4 text-sm text-muted-foreground sm:px-6">{lead.source}</td>
                          <td className="px-4 py-4 text-sm text-muted-foreground sm:px-6">{lead.service_interest ?? "-"}</td>
                          <td className="px-4 py-4 sm:px-6">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass[lead.status]}`}
                            >
                              {statusLabel[lead.status]}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs text-muted-foreground sm:px-6">
                            {new Date(lead.created_at).toLocaleString("en-CA")}
                          </td>
                          <td className="px-4 py-4 sm:px-6">
                            <div className="flex items-center gap-2">
                              <select
                                value={lead.status}
                                disabled={isPending}
                                className="h-8 rounded-full border border-brand/15 bg-white px-3 text-xs text-foreground disabled:opacity-70"
                                onChange={(event) => {
                                  const value = event.target.value as LeadStatus;
                                  void updateLeadStatus(lead.id, value).catch((statusError) => {
                                    setError(
                                      statusError instanceof Error
                                        ? statusError.message
                                        : "Unable to update lead",
                                    );
                                  });
                                }}
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="converted">Converted</option>
                                <option value="closed">Closed</option>
                              </select>
                              <button
                                type="button"
                                disabled={isPending || lead.status === "converted"}
                                className="inline-flex h-8 items-center gap-1 rounded-full border border-brand/15 bg-white px-3 text-xs font-semibold text-brand transition-colors hover:bg-brand/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => {
                                  void convertLead(lead.id).catch((convertError) => {
                                    setError(
                                      convertError instanceof Error
                                        ? convertError.message
                                        : "Unable to convert lead",
                                    );
                                  });
                                }}
                              >
                                {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <UserCheck className="size-3.5" />}
                                Convert
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="surface-solid border-brand/10 bg-white/95 p-5">
              <h3 className="text-sm font-semibold text-brand">Create Booking Slot</h3>
              <p className="mt-1 text-xs text-muted-foreground">Add available consultation windows for bookings.</p>

              <form className="mt-4 space-y-3" onSubmit={createSlot}>
                <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Start
                  <input
                    type="datetime-local"
                    value={slotForm.startsAt}
                    onChange={(event) =>
                      setSlotForm((current) => ({ ...current, startsAt: event.target.value }))
                    }
                    required
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground outline-none transition-colors focus:border-brand/35"
                  />
                </label>

                <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  End
                  <input
                    type="datetime-local"
                    value={slotForm.endsAt}
                    onChange={(event) =>
                      setSlotForm((current) => ({ ...current, endsAt: event.target.value }))
                    }
                    required
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground outline-none transition-colors focus:border-brand/35"
                  />
                </label>

                <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Timezone
                  <input
                    type="text"
                    value={slotForm.timezone}
                    onChange={(event) =>
                      setSlotForm((current) => ({ ...current, timezone: event.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground outline-none transition-colors focus:border-brand/35"
                  />
                </label>

                <button
                  type="submit"
                  disabled={savingSlot}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-brand-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingSlot ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                  {savingSlot ? "Saving..." : "Add Slot"}
                </button>
              </form>
            </div>

            <div className="surface-solid border-brand/10 bg-white/95 p-5">
              <h3 className="text-sm font-semibold text-brand">Upcoming Slots</h3>
              <div className="mt-3 max-h-80 space-y-2 overflow-auto">
                {slots.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No slots created yet.</p>
                ) : (
                  slots.map((slot) => (
                    <div key={slot.id} className="rounded-xl border border-border bg-white p-3 text-xs">
                      <p className="font-medium text-foreground">{new Date(slot.starts_at).toLocaleString("en-CA")}</p>
                      <p className="mt-1 text-muted-foreground">Ends: {new Date(slot.ends_at).toLocaleString("en-CA")}</p>
                      <p className="mt-1 text-muted-foreground">{slot.timezone}</p>
                      <span
                        className={`mt-2 inline-flex rounded-full px-2 py-0.5 font-semibold ${slot.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {slot.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
