import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { AdminPageClient } from "./client";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Leads",
  description:
    "Internal admin dashboard for leads, booking slots, and client workflow at TrustEdge Tax Services.",
  path: "/admin",
});

export default function AdminPage() {
  return <AdminPageClient />;
}
