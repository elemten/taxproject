<INSTRUCTIONS>
# TrustEdge Tax Services — Project Guide

## Project summary
- SEO-first marketing website mockup for TrustEdge Tax Services (Saskatoon, Saskatchewan).
- Focus pages: Home, Services index, 3 service detail pages, About, Contact, FAQ, local SEO landing.
- Branding: premium, calm, Apple-like; warm gold accent; content is placeholder but production‑ready.

## Tech stack
- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Icons: lucide-react
- Utilities: clsx + tailwind-merge

## Key locations
- App entry/pages: `src/app/*`
  - Home: `src/app/page.tsx`
  - Services: `src/app/services/*`
  - About/Contact/FAQ: `src/app/about`, `src/app/contact`, `src/app/faq`
  - SEO: `src/app/robots.ts`, `src/app/sitemap.ts`
- Shared components: `src/components/*`
- Site config/content: `src/lib/site.ts`
- Global styles: `src/app/globals.css`

## Project goals (from TASK.md)
- Polished responsive mockup, SEO-ready structure.
- Clear CTA paths (call/email/book consult).
- Local SEO emphasis: Saskatoon + Saskatchewan.
- No backend integrations yet (forms are placeholders).

## Non-goals
- No Supabase/auth/CRM/payments in this phase.
- No legal/tax advice beyond generic marketing copy.

## Commands
- Dev: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Start: `npm run start`

## Conventions & UI notes
- Keep layout aligned to `ahbooktax.ca` structure (feel/sections only).
- Prefer reusable components in `src/components`.
- Maintain consistent radius + shadows; avoid layered glows/blur that create edge artifacts.
- Keep copy concise and premium; emphasize clarity and trust.

## Recent changes
- Added a hero booking preview widget component with calendar visuals: `src/components/booking-consultation-card.tsx`
- Hero now includes the booking preview on large screens: `src/app/page.tsx`
</INSTRUCTIONS>
