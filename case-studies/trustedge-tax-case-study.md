# TrustEdge Tax Services — SEO-focused marketing mockup

## Brief
Reimagined an SEO-first marketing site for TrustEdge Tax Services in Saskatoon by mirroring the section rhythm of the reference site while leaning into a premium, calm, Apple-like visual language. The hypothesis: a focused service narrative, local proof points, and crystal-clear conversion paths would make the mockup feel production ready without any backend integrations running yet.

## Challenge
- Translate the `ahbooktax.ca` sectional layout into the project’s Tailwind/Turbopack stack while keeping copy and visuals tailored to Saskatchewan tax service buyers.
- Reinforce local SEO signals (Saskatoon, Saskatchewan) in code and copy while still keeping the site generic enough for placeholder content and future data sources.
- Provide a credible engagement path for every visitor (call, contact form, booking preview widget) even though the project is strictly a mockup in this phase.

## Approach
1. **Structure the experience around reusable components and SEO plumbing.** The `SiteShell`/`SiteHeader`/`SiteFooter` frame (`src/components/site-shell.tsx:1`, `src/components/site-header.tsx:1`, `src/components/site-footer.tsx:1`) match the hero–content–CTA rhythm from the reference while keeping navigation, contact, and hours visible on every page.
2. **Center the homepage on trust-building storytelling.** `src/app/home-client.tsx:1` stitches a hero, service highlight cards, process steps, testimonials, FAQ preview, and the booking preview widget so the page mirrors the feel of the inspiration site. The hero keeps a large booking preview on wide screens by embedding `BookingConsultationCard` (`src/components/booking-consultation-card.tsx:1`) next to the value prop, which makes “Book consult” feel tangible even though actual scheduling is mocked.
3. **Make each service detail page turnkey.** `ServicePage` (`src/components/service-page.tsx:1`) takes reusable `whoFor`, `included`, and `bring` arrays, so the `/services/personal-tax`, `/services/corporate-tax`, and `/services/estate-planning` pages can stay light while staying consistent; each page still delivers CTA buttons, “book a consultation” anchors, and imagery tailored to the line of service (`src/app/services/personal-tax/page.tsx:1`).
4. **Keep engagement surfaces polished.** The `LeadForm` (`src/components/lead-form.tsx:1`) renders in the contact page (`src/app/contact/client.tsx:1`), animating badges, the CTA button, and a status area while emulating future Supabase-backed submissions via `/api/contact/submit` (`src/app/api/contact/submit/route.ts:1`). Every content page references the `site` config object (`src/lib/site.ts:1`), so contact info, service navigation, and hours are centralized for quick updates.
5. **Reinforce local SEO and schema expectations.** `buildPageMetadata` (`src/lib/seo.ts:1`), `robots.ts` (`src/app/robots.ts:1`), `sitemap.ts` (`src/app/sitemap.ts:1`), `StructuredData` (`src/components/structured-data.tsx:1`), and the FAQ schema in `src/app/faq/client.tsx:1` work together to supply canonical URLs, social previews, structured local-business schema, and FAQ JSON-LD that search engines expect from a local-service site.
6. **Deliver a dedicated local landing page.** The `/saskatoon-tax-services` page (`src/app/saskatoon-tax-services/client.tsx:1`) doubles down on Saskatoon and Saskatchewan messaging, quick links to service lines, and CTA buttons that slot into the same design system.

## Outcome
- A cohesive set of marketing pages (home, services index, service details, About, Contact, FAQ, local landing) with consistent typography, spacing, and motion thanks to shared components and the Tailwind v4 theme defined in `globals.css`.
- Ready-to-launch SEO foundation: metadata builder, robots/sitemap generation, structured data, and canonical wiring mean the mockup already satisfies technical requirements for future deployment.
- Engagement paths are diversified (hero booking preview widget, sticky CTAs, lead form, clickable phone/email links) so the experience feels like a real service site even before backend data is connected.

## Tech
- Next.js App Router with App-level metadata and font optimization (`src/app/layout.tsx:1`).
- Reusable component library (`booking-consultation-card`, `service-card`, `LeadForm`, `AnimatedAccordion`) kept motion-friendly via Framer Motion and accessible via targeted aria labels.
- SEO tooling (metadata builder, robots/sitemap routes, structured data, FAQ schema) baked into the framework for immediate discoverability.
