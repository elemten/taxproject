"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  Search,
  UserCheck,
  Users,
  Users2,
} from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "closed";
type StatusFilter = LeadStatus | "all";
type AdminSection = "dashboard" | "leads" | "clients" | "bookings";

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

type ClientRow = {
  id: string;
  lead_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  client_status: string;
  created_at: string;
};

type BookingLead = {
  name: string;
  email: string;
  phone: string;
  service_interest: string | null;
};

type BookingSlot = {
  starts_at: string;
  timezone: string;
};

type BookedBookingRow = {
  id: string;
  status: "booked";
  booked_at: string;
  lead: BookingLead | null;
  slot: BookingSlot | null;
};

type DashboardResponse = {
  stats: {
    totalLeads: number;
    newLeads: number;
    activeBookings: number;
    totalClients: number;
  };
  leads: LeadRow[];
};

type StatItem = {
  label: "Total Leads" | "New Leads" | "Active Bookings";
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
  { value: "converted", label: "Converted" },
];

const leadActionStatusOptions: LeadStatus[] = ["new", "contacted"];

const sectionMeta: Record<AdminSection, { title: string; description: string }> = {
  dashboard: {
    title: "Dashboard",
    description: "Lead and booking overview.",
  },
  leads: {
    title: "Leads",
    description: "Manage lead status and conversions.",
  },
  clients: {
    title: "Clients",
    description: "View converted clients.",
  },
  bookings: {
    title: "Booked Bookings",
    description: "Confirmed booking records.",
  },
};

const formatDateTime = (value: string) => new Date(value).toLocaleString("en-CA");

export function AdminPageClient() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [bookings, setBookings] = useState<BookedBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const refreshData = useCallback(async (manualRefresh = false) => {
    if (manualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [leadsResponse, clientsResponse, bookingsResponse] = await Promise.all([
        fetch("/api/admin/leads", { cache: "no-store" }),
        fetch("/api/admin/clients", { cache: "no-store" }),
        fetch("/api/admin/bookings", { cache: "no-store" }),
      ]);

      const leadsResult = (await leadsResponse.json().catch(() => null)) as
        | DashboardResponse
        | { error?: string }
        | null;
      const clientsResult = (await clientsResponse.json().catch(() => null)) as
        | { clients: ClientRow[]; error?: string }
        | { error?: string }
        | null;
      const bookingsResult = (await bookingsResponse.json().catch(() => null)) as
        | { bookings: BookedBookingRow[]; error?: string }
        | { error?: string }
        | null;

      if (!leadsResponse.ok) {
        throw new Error((leadsResult as { error?: string } | null)?.error ?? "Failed to load leads");
      }

      if (!clientsResponse.ok) {
        throw new Error((clientsResult as { error?: string } | null)?.error ?? "Failed to load clients");
      }

      if (!bookingsResponse.ok) {
        throw new Error((bookingsResult as { error?: string } | null)?.error ?? "Failed to load bookings");
      }

      setDashboard(leadsResult as DashboardResponse);
      setClients((clientsResult as { clients: ClientRow[] }).clients ?? []);
      setBookings((bookingsResult as { bookings: BookedBookingRow[] }).bookings ?? []);
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
      { label: "Active Bookings", value: dashboard.stats.activeBookings },
    ];
  }, [dashboard]);

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
        icon: LayoutDashboard,
        count: stats[0]?.value ?? 0,
      },
      {
        id: "leads" as const,
        label: "Leads",
        icon: Users2,
        count: dashboard?.stats.totalLeads ?? 0,
      },
      {
        id: "clients" as const,
        label: "Clients",
        icon: Users,
        count: dashboard?.stats.totalClients ?? clients.length,
      },
      {
        id: "bookings" as const,
        label: "Booked Bookings",
        icon: CalendarClock,
        count: dashboard?.stats.activeBookings ?? bookings.length,
      },
    ],
    [bookings.length, clients.length, dashboard?.stats.activeBookings, dashboard?.stats.totalClients, dashboard?.stats.totalLeads, stats],
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

  return (
    <section className="min-h-dvh bg-slate-100 py-4 sm:py-6" data-admin-shell>
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "grid gap-4",
            sidebarCollapsed
              ? "lg:grid-cols-[4.75rem_minmax(0,1fr)]"
              : "lg:grid-cols-[18rem_minmax(0,1fr)]",
          )}
        >
          <aside className="lg:sticky lg:top-4 lg:h-[calc(100dvh-2rem)] lg:self-start">
            <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="border-b border-slate-200 pb-4">
                <div className={cn("flex items-start", sidebarCollapsed ? "justify-center" : "justify-between") }>
                  <div className={cn(sidebarCollapsed ? "hidden" : "block")}>
                    <SiteLogo variant="icon" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSidebarCollapsed((current) => !current)}
                    aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
                  </Button>
                </div>
                {!sidebarCollapsed ? (
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#062B68]">Admin Portal</p>
                ) : null}
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
                        "flex w-full items-center rounded-xl border transition-colors",
                        sidebarCollapsed ? "justify-center px-2 py-2.5" : "justify-between px-3 py-3 text-left",
                        isActive
                          ? "border-[#062B68] bg-[#062B68] text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-[#FEBF04] hover:bg-[#FFF9E8]",
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-2.5">
                        <ItemIcon className="size-4" />
                        {!sidebarCollapsed ? (
                          <div>
                            <p className="text-sm font-semibold">{item.label}</p>
                          </div>
                        ) : null}
                      </div>
                      {!sidebarCollapsed ? (
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-xs font-semibold",
                            isActive ? "bg-white/15 text-white" : "bg-[#FFF4CC] text-[#7A5A00]",
                          )}
                        >
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
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
                        <p className="text-4xl font-semibold text-[#062B68]">{stat.value}</p>
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
                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass[lead.status]}`}>
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
                  <CardTitle>Leads</CardTitle>
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
                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass[lead.status]}`}>
                                  {statusLabel[lead.status]}
                                </span>
                              </TableCell>
                              <TableCell className="text-xs text-slate-500">{formatDateTime(lead.created_at)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {lead.status === "converted" ? (
                                    <span className="inline-flex h-8 items-center rounded-full bg-[#E8EEF8] px-3 text-xs font-semibold text-[#062B68]">
                                      Converted
                                    </span>
                                  ) : (
                                    <Select
                                      value={lead.status}
                                      disabled={isPending}
                                      className="h-8 min-w-28 border-slate-200 text-xs"
                                      onChange={(event) => {
                                        void updateLeadStatus(lead.id, event.target.value as LeadStatus);
                                      }}
                                    >
                                      {leadActionStatusOptions.map((option) => (
                                        <option key={option} value={option}>
                                          {statusLabel[option]}
                                        </option>
                                      ))}
                                    </Select>
                                  )}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="border-[#062B68]/30 text-[#062B68] hover:bg-[#FFF9E8]"
                                    disabled={isPending || lead.status !== "contacted"}
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

            {activeSection === "clients" ? (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Clients</CardTitle>
                  <CardDescription>{clients.length} total clients</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {loading ? (
                    <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
                      <Loader2 className="size-4 animate-spin" />
                      Loading clients...
                    </div>
                  ) : clients.length === 0 ? (
                    <div className="py-6 text-sm text-slate-500">No clients yet.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell className="font-medium text-[#062B68]">{client.name}</TableCell>
                            <TableCell className="text-xs text-slate-600">{client.email ?? "-"}</TableCell>
                            <TableCell className="text-xs text-slate-600">{client.phone ?? "-"}</TableCell>
                            <TableCell>
                              <span className="inline-flex rounded-full bg-[#E8EEF8] px-2.5 py-1 text-xs font-semibold text-[#062B68]">
                                {client.client_status}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-slate-500">{formatDateTime(client.created_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {activeSection === "bookings" ? (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Booked Bookings</CardTitle>
                  <CardDescription>{bookings.length} booked records</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {loading ? (
                    <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
                      <Loader2 className="size-4 animate-spin" />
                      Loading bookings...
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="py-6 text-sm text-slate-500">No booked bookings yet.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booked At</TableHead>
                          <TableHead>Slot</TableHead>
                          <TableHead>Lead</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Service</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="text-xs text-slate-500">{formatDateTime(booking.booked_at)}</TableCell>
                            <TableCell className="text-xs text-slate-600">
                              {booking.slot ? formatDateTime(booking.slot.starts_at) : "-"}
                            </TableCell>
                            <TableCell className="font-medium text-[#062B68]">{booking.lead?.name ?? "-"}</TableCell>
                            <TableCell className="text-xs text-slate-600">{booking.lead?.email ?? "-"}</TableCell>
                            <TableCell className="text-xs text-slate-600">{booking.lead?.service_interest ?? "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            ) : null}
          </main>
        </div>
      </div>
    </section>
  );
}
