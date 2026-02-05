import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const routes = [
    "/",
    "/services",
    "/services/personal-tax",
    "/services/corporate-tax",
    "/services/estate-planning",
    "/about",
    "/faq",
    "/contact",
    "/saskatoon-tax-services",
  ];

  return routes.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
