import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { AdminPageClient } from "./client";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Leads",
  description:
    "Internal mock admin leads dashboard showing sample lead pipeline data for TrustEdge Tax Services.",
  path: "/admin",
});

export default function AdminPage() {
  return <AdminPageClient />;
}
