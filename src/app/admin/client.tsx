"use client";

import {
  Bell,
  Download,
  Filter,
  HelpCircle,
  MoreHorizontal,
  Plus,
  Search,
  Timer,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { SiteLogo } from "@/components/site-logo";

type LeadStatus = "New" | "Contacted" | "Qualified" | "In Progress";
type LeadPriority = "High" | "Medium" | "Low";

type LeadRow = {
  initials: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: string;
  priority: LeadPriority;
  owner: string;
};

const stats = [
  {
    label: "Total Leads",
    value: "2,492",
    note: "+14%",
    noteIcon: TrendingUp,
    noteClass: "text-emerald-700",
  },
  {
    label: "Conversion",
    value: "22.4%",
    note: "+5.2%",
    noteIcon: TrendingUp,
    noteClass: "text-emerald-700",
  },
  {
    label: "Pending Tasks",
    value: "18",
    note: "Urgent",
    noteIcon: TriangleAlert,
    noteClass: "text-red-600",
  },
  {
    label: "Avg. Response",
    value: "1.2h",
    note: "Good",
    noteIcon: Timer,
    noteClass: "text-emerald-700",
  },
] as const;

const leads: LeadRow[] = [
  {
    initials: "JD",
    name: "Johnathan Doe",
    email: "j.doe@example.com",
    status: "New",
    source: "Website Form",
    priority: "High",
    owner: "Sarah Miller",
  },
  {
    initials: "AS",
    name: "Alice Sterling",
    email: "alice@fintech.io",
    status: "Contacted",
    source: "LinkedIn Referral",
    priority: "Medium",
    owner: "Michael Chen",
  },
  {
    initials: "RM",
    name: "Rahul Malhotra",
    email: "rahul@northview.ca",
    status: "In Progress",
    source: "Google Ads",
    priority: "High",
    owner: "Sarah Miller",
  },
  {
    initials: "LK",
    name: "Linda Kapoor",
    email: "linda.k@prairiepro.com",
    status: "Qualified",
    source: "Direct Referral",
    priority: "Low",
    owner: "Noah Patel",
  },
] as const;

const statusClass: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-amber-100 text-amber-700",
  Qualified: "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-violet-100 text-violet-700",
};

const priorityClass: Record<LeadPriority, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-slate-100 text-slate-700",
};

export function AdminPageClient() {
  return (
    <section className="bg-background">
      <div className="container-page py-10 sm:py-14">
        <div className="space-y-6">
          <div className="surface-solid border-brand/15 bg-white/90 p-4 sm:p-5">
            <div className="rounded-2xl bg-brand px-4 py-4 text-brand-foreground sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <SiteLogo variant="icon" />
                  <div className="hidden h-8 w-px bg-white/25 md:block" />
                  <div className="hidden items-center gap-5 text-sm font-semibold md:flex">
                    <span className="opacity-85">Dashboard</span>
                    <span className="border-b-2 border-current pb-1">Leads</span>
                    <span className="opacity-85">Reports</span>
                    <span className="opacity-85">Settings</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="relative hidden sm:block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/70" />
                    <input
                      type="search"
                      placeholder="Search leads..."
                      className="h-10 rounded-full border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white placeholder:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    />
                  </label>
                  <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20"
                  >
                    <Bell className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20"
                  >
                    <HelpCircle className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
                Leads Overview
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Internal management mockup for TrustEdge Tax Services prospects.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="size-4" />
              Add New Lead
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.noteIcon;
              return (
                <article
                  key={stat.label}
                  className="surface-solid border-brand/10 bg-white/92 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/70">
                    {stat.label}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-3xl font-semibold tracking-tight text-brand">
                      {stat.value}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${stat.noteClass}`}
                    >
                      <Icon className="size-3.5" />
                      {stat.note}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="surface-solid border-brand/10 bg-white/92">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand/10 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-5 text-sm font-semibold">
                <button type="button" className="border-b-2 border-brand pb-1 text-brand">
                  All Leads
                </button>
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  Qualified
                </button>
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  In Progress
                </button>
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  Archived
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1 rounded-full border border-brand/15 bg-white px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <Filter className="size-3.5" />
                  Filter
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1 rounded-full border border-brand/15 bg-white px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <Download className="size-3.5" />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left">
                <thead className="bg-brand/[0.04]">
                  <tr>
                    {[
                      "Lead Name",
                      "Status",
                      "Source",
                      "Priority",
                      "Assigned Owner",
                      "Actions",
                    ].map((col) => (
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
                  {leads.map((lead) => (
                    <tr key={lead.email} className="hover:bg-brand/[0.03]">
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                            {lead.initials}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-brand">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[lead.status]}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground sm:px-6">
                        {lead.source}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClass[lead.priority]}`}
                        >
                          {lead.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-muted-foreground sm:px-6">
                        {lead.owner}
                      </td>
                      <td className="px-4 py-4 text-right sm:px-6">
                        <button type="button" className="text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
