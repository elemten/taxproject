export function getSiteUrl() {
  const fallback =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://trustedgetax.ca";
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? fallback;
  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(normalized);
  } catch {
    return new URL(fallback);
  }
}
