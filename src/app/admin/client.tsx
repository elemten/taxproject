"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarClock, LayoutDashboard, Loader2, RefreshCw, Search, UserCheck, Users2 } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "closed";
type StatusFilter = LeadStatus | "all";
type AdminSection = "dashboard" | "leads" | "slots";

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
};

const statusBadgeClass: Record<LeadStatus, string> = {
  new: "bg-[#FFF4CC] text-[#7A5A00]",
  contacted: "bg-[#E8EEF8] text-[#062B68]",
  qualified: "bg-[#FFF4CC] text-[#7A5A00]",
  converted: "bg-[#062B68] text-white",
  closed: "bg-slate-200 text-slate-700",
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

const leadStatusOptions: LeadStatus[] = ["new", "contacted", "qualified", "converted", "closed"];

const sectionMeta: Record<AdminSection, { title: string; description: string }> = {
  dashboard: {
    title: "Dashboard",
    description: "Pipeline visibility and high-level metrics.",
  },
  leads: {
    title: "Lead Functions",
    description: "Search, filter, update status, and convert leads.",
  },
  slots: {
    title: "Booking Functions",
    description: "Create and monitor consultation slots.",
  },
};

const formatDateTime = (value: string) => new Date(value).toLocaleString("en-CA");

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
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
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
        throw new Error((leadsResult as { error?: string } | null)?.error ?? "Failed to load leads");
      }

      if (!slotsResponse.ok) {
        throw new Error((slotsResult as { error?: string } | null)?.error ?? "Failed to load slots");
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
      { label: "Total Leads", value: dashboard.stats.totalLeads },
      { label: "New Leads", value: dashboard.stats.newLeads },
      { label: "Qualified", value: dashboard.stats.qualifiedLeads },
      { label: "Converted", value: dashboard.stats.convertedLeads },
      { label: "Active Bookings", value: dashboard.stats.activeBookings },
      { label: "Open Slots", value: slots.filter((slot) => slot.is_active).length },
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

      const searchableText = [lead.name, lead.email, lead.phone, lead.source, lead.service_interest ?? ""]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [dashboard, searchQuery, statusFilter]);

  const sidebarItems = useMemo(
    () => [
      {
        id: "dashboard" as const,
        label: "Dashboard",
        hint: "Overview",
        icon: LayoutDashboard,
        count: stats.length > 0 ? stats[0]?.value ?? 0 : 0,
      },
      {
        id: "leads" as const,
        label: "Lead Functions",
        hint: "Pipeline",
        icon: Users2,
        count: dashboard?.leads.length ?? 0,
      },
      {
        id: "slots" as const,
        label: "Booking Functions",
        hint: "Calendar",
        icon: CalendarClock,
        count: slots.length,
      },
    ],
    [dashboard?.leads.length, slots.length, stats],
  );

  const recentLeads = useMemo(() => (dashboard?.leads ?? []).slice(0, 6), [dashboard]);

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
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update lead");
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
    } catch (convertError) {
      setError(convertError instanceof Error ? convertError.message : "Unable to convert lead");
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
      setActiveSection("slots");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create slot");
    } finally {
      setSavingSlot(false);
    }
  };

  return (
    <section className="min-h-dvh bg-slate-100 py-4 sm:py-6" data-admin-shell>
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-4 lg:h-[calc(100dvh-2rem)] lg:self-start">
            <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="border-b border-slate-200 pb-4">
                <SiteLogo variant="icon" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#062B68]">Admin Portal</p>
              </div>

              <nav className="mt-4 space-y-2">
                {sidebarItems.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors",
                        isActive
                          ? "border-[#062B68] bg-[#062B68] text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-[#FEBF04] hover:bg-[#FFF9E8]",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <ItemIcon className="size-4" />
                        <div>
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className={cn("text-xs", isActive ? "text-white/75" : "text-slate-500")}>{item.hint}</p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-semibold",
                          isActive ? "bg-white/15 text-white" : "bg-[#FFF4CC] text-[#7A5A00]",
                        )}
                      >
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto rounded-xl bg-[#062B68] p-4 text-white">
                <p className="text-xs uppercase tracking-[0.14em] text-white/75">Last Sync</p>
                <p className="mt-1 text-lg font-semibold">{lastUpdatedLabel || "--:--"}</p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3 w-full bg-[#FEBF04] text-[#062B68] hover:bg-[#f3b400]"
                  onClick={() => void refreshData(true)}
                  disabled={refreshing || loading}
                >
                  {refreshing || loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}
                  Refresh Data
                </Button>
              </div>
            </div>
          </aside>

          <main className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="h-1 w-16 rounded-full bg-[#FEBF04]" />
              <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#062B68]">TrustEdge Admin</p>
                  <h1 className="mt-1 text-2xl font-semibold text-[#062B68]">{sectionMeta[activeSection].title}</h1>
                  <p className="mt-1 text-sm text-slate-600">{sectionMeta[activeSection].description}</p>
                </div>
                <Button type="button" variant="outline" onClick={() => void refreshData(true)} disabled={refreshing || loading}>
                  {refreshing || loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}
                  Refresh
                </Button>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : null}

            {activeSection === "dashboard" ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {stats.map((stat) => (
                    <Card key={stat.label} className="border-slate-200">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase tracking-[0.14em] text-[#062B68]/80">{stat.label}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-semibold text-[#062B68]">{stat.value}</p>
                        <div className="mt-3 h-1 w-10 rounded-full bg-[#FEBF04]" />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Recent Leads</CardTitle>
                    <CardDescription>Latest lead entries at a glance.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {loading ? (
                      <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
                        <Loader2 className="size-4 animate-spin" />
                        Loading recent leads...
                      </div>
                    ) : recentLeads.length === 0 ? (
                      <p className="py-6 text-sm text-slate-500">No leads yet.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Lead</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentLeads.map((lead) => (
                            <TableRow key={lead.id}>
                              <TableCell>
                                <p className="font-medium text-[#062B68]">{lead.name}</p>
                                <p className="text-xs text-slate-500">{lead.email}</p>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass[lead.status]}`}
                                >
                                  {statusLabel[lead.status]}
                                </span>
                              </TableCell>
                              <TableCell className="text-xs text-slate-600">{lead.source}</TableCell>
                              <TableCell className="text-xs text-slate-500">{formatDateTime(lead.created_at)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : null}

            {activeSection === "leads" ? (
              <Card className="border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle>Lead Pipeline</CardTitle>
                  <CardDescription>
                    Showing {visibleLeads.length} of {dashboard?.leads.length ?? 0} leads.
                  </CardDescription>

                  <div className="mt-2 grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="search"
                        placeholder="Search name, email, phone, source"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="border-slate-200 pl-10"
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                      className="border-slate-200"
                    >
                      {statusFilters.map((filter) => (
                        <option key={filter.value} value={filter.value}>
                          {filter.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {loading ? (
                    <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
                      <Loader2 className="size-4 animate-spin" />
                      Loading leads...
                    </div>
                  ) : visibleLeads.length === 0 ? (
                    <div className="py-6 text-sm text-slate-500">No leads match the current filters.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Lead</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="min-w-52">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleLeads.map((lead) => {
                          const isPending = pendingLeadId === lead.id;

                          return (
                            <TableRow key={lead.id}>
                              <TableCell>
                                <p className="font-medium text-[#062B68]">{lead.name}</p>
                                <p className="text-xs text-slate-500">{lead.email}</p>
                              </TableCell>
                              <TableCell className="text-xs text-slate-600">{lead.phone}</TableCell>
                              <TableCell className="text-xs text-slate-600">{lead.source}</TableCell>
                              <TableCell className="text-xs text-slate-600">{lead.service_interest ?? "-"}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass[lead.status]}`}
                                >
                                  {statusLabel[lead.status]}
                                </span>
                              </TableCell>
                              <TableCell className="text-xs text-slate-500">{formatDateTime(lead.created_at)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={lead.status}
                                    disabled={isPending}
                                    className="h-8 min-w-28 border-slate-200 text-xs"
                                    onChange={(event) => {
                                      void updateLeadStatus(lead.id, event.target.value as LeadStatus);
                                    }}
                                  >
                                    {leadStatusOptions.map((option) => (
                                      <option key={option} value={option}>
                                        {statusLabel[option]}
                                      </option>
                                    ))}
                                  </Select>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="border-[#062B68]/30 text-[#062B68] hover:bg-[#FFF9E8]"
                                    disabled={isPending || lead.status === "converted"}
                                    onClick={() => {
                                      void convertLead(lead.id);
                                    }}
                                  >
                                    {isPending ? (
                                      <Loader2 className="mr-1 size-3.5 animate-spin" />
                                    ) : (
                                      <UserCheck className="mr-1 size-3.5" />
                                    )}
                                    Convert
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {activeSection === "slots" ? (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Create Booking Slot</CardTitle>
                    <CardDescription>Add available consultation windows for booking requests.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-3" onSubmit={createSlot}>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600" htmlFor="slot-start">
                          Start
                        </label>
                        <Input
                          id="slot-start"
                          type="datetime-local"
                          value={slotForm.startsAt}
                          onChange={(event) => setSlotForm((current) => ({ ...current, startsAt: event.target.value }))}
                          className="border-slate-200"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600" htmlFor="slot-end">
                          End
                        </label>
                        <Input
                          id="slot-end"
                          type="datetime-local"
                          value={slotForm.endsAt}
                          onChange={(event) => setSlotForm((current) => ({ ...current, endsAt: event.target.value }))}
                          className="border-slate-200"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600" htmlFor="slot-timezone">
                          Timezone
                        </label>
                        <Input
                          id="slot-timezone"
                          type="text"
                          value={slotForm.timezone}
                          onChange={(event) => setSlotForm((current) => ({ ...current, timezone: event.target.value }))}
                          className="border-slate-200"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={savingSlot}
                        className="w-full bg-[#062B68] text-white hover:bg-[#041f4c]"
                      >
                        {savingSlot ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                        {savingSlot ? "Saving..." : "Add Slot"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Upcoming Slots</CardTitle>
                    <CardDescription>{slots.length} total slot records</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="max-h-[34rem] space-y-3 overflow-auto pr-1">
                      {slots.length === 0 ? (
                        <p className="py-2 text-sm text-slate-500">No slots created yet.</p>
                      ) : (
                        slots.map((slot) => (
                          <div key={slot.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-sm font-semibold text-[#062B68]">{formatDateTime(slot.starts_at)}</p>
                            <p className="mt-1 text-xs text-slate-600">Ends: {formatDateTime(slot.ends_at)}</p>
                            <p className="mt-1 text-xs text-slate-500">{slot.timezone}</p>
                            <span
                              className={cn(
                                "mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                                slot.is_active ? "bg-[#FFF4CC] text-[#7A5A00]" : "bg-slate-200 text-slate-600",
                              )}
                            >
                              {slot.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </section>
  );
}
