import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const defaultLastModified = new Date("2026-02-06T00:00:00.000Z");

  const routes: Array<{
    path: `/${string}`;
    changeFrequency: "weekly" | "monthly";
    priority: number;
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/services", changeFrequency: "weekly", priority: 0.9 },
    { path: "/services/personal-tax", changeFrequency: "monthly", priority: 0.85 },
    { path: "/services/corporate-tax", changeFrequency: "monthly", priority: 0.85 },
    { path: "/services/estate-planning", changeFrequency: "monthly", priority: 0.85 },
    { path: "/about", changeFrequency: "monthly", priority: 0.75 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "weekly", priority: 0.8 },
    { path: "/saskatoon-tax-services", changeFrequency: "weekly", priority: 0.88 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: defaultLastModified,
    changeFrequency,
    priority,
  }));
}
