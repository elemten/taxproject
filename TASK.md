# TrustEdge Tax Services — Website Mockup (SEO-first)

## Project summary
Build a **marketing website mockup** for **TrustEdge Tax Services** focused on three service lines:
- Personal Tax
- Corporate Tax
- Estate Management Services

Primary audience: **Saskatchewan** clients (priority: **Saskatoon**).

Reference style: customer likes the look/structure of `ahbooktax.ca` (we’ll mirror the *feel* and section rhythm, not copy assets/content).

## Goals (what “done” means)
- A polished, responsive website mockup that looks production-ready.
- SEO-friendly structure for “Saskatoon / Saskatchewan tax services” queries.
- Clear conversion paths (call/email/book consult CTAs) even if forms are placeholders.
- Clean codebase that can later plug into Supabase for client tracking (not implemented now).

## Non-goals (explicitly out of scope for now)
- Supabase auth/database, admin dashboards, CRM, invoicing.
- Payment processing.
- Legal/tax advice content beyond general marketing copy + disclaimers.

## Recommended tech stack (mockup now, scalable later)
**Front-end / SEO**
- **Next.js (App Router) + React (latest stable) + TypeScript**
  - Strong SEO defaults (SSR/SSG), routing, metadata, performance.
- **Tailwind CSS v4**
  - Fast iteration for mockups + consistent design system.

**Content**
- Start with static content in code (simple), optionally move to **MDX** later for blog/resources.

**Icons / UI helpers (optional)**
- `lucide-react` for icons
- `clsx` + `tailwind-merge` for class composition
- (Optional) `shadcn/ui` if we want prebuilt accessible primitives quickly

**Later (not now)**
- Supabase (clients, leads, follow-ups)
- PostHog/GA for analytics
- Resend/SendGrid for email capture

## Information architecture (pages)
Minimum mockup pages (SEO-focused):
1. Home (`/`)
2. Services index (`/services`)
3. Service detail pages:
   - Personal Tax (`/services/personal-tax`)
   - Corporate Tax (`/services/corporate-tax`)
   - Estate Management (`/services/estate-management`)
4. About (`/about`)
5. Contact (`/contact`)

Nice-to-have for SEO/trust:
- FAQ (`/faq`)
- Resources/Blog (`/resources`) (can be “coming soon” or 2–3 starter posts)
- Service area page (`/saskatoon-tax-services`) (local SEO landing)

## Homepage section outline (reference-style structure)
- Header/nav with primary CTA (Book consult / Call)
- Hero: value prop + local qualifier (Saskatoon, SK)
- “How we help” (3 cards for the service lines)
- Why TrustEdge (trust signals, process, turnaround, accuracy)
- Process steps (Discover → Prepare → Review → File)
- Testimonials (placeholder if none)
- FAQ preview
- Final CTA + footer with contact/NAP

## SEO checklist (for Saskatoon/Saskatchewan)
- Titles/H1s focused on intent:
  - Example: “Tax Preparation in Saskatoon, SK | TrustEdge Tax Services”
- Local signals:
  - NAP block (Name, Address, Phone) in footer + contact page
  - Service area copy: Saskatoon + Saskatchewan mentions (natural language)
- Technical:
  - `robots.txt`, `sitemap.xml`
  - Open Graph / Twitter cards
  - Canonical URLs
  - Fast LCP (optimize images, use `next/image`, good font loading)
- Structured data (JSON-LD):
  - LocalBusiness / ProfessionalService schema
  - FAQ schema on FAQ page (if present)
- Content:
  - Each service page answers: who it’s for, what’s included, what you need, timeline, pricing approach, CTA

## Design direction (Saskatchewan-friendly, not locked)
We’ll present 2–3 lightweight directions (pick one):
- **Prairie Modern**: calm neutrals + “prairie sky” blue accent
- **Trust & Heritage**: deep navy/forest + warm gold accent
- **Clean Professional**: white/gray base + one strong accent color

Brand assets (logo/colors) can be placeholders, but we’ll structure the code so swapping later is easy.

## Deliverables
- A running dev site with the full mockup pages above.
- Reusable components: header, footer, CTA blocks, service cards, FAQ accordion, testimonial cards.
- Basic SEO plumbing (metadata, sitemap/robots, structured data where applicable).

## Proposed build steps (once approved)
1. Scaffold Next.js + Tailwind v4 + TypeScript
2. Create layout, typography scale, spacing, container rules
3. Build shared components (Header/Footer/Buttons/Sections)
4. Implement pages + responsive behavior
5. Add SEO essentials (metadata, sitemap, robots, JSON-LD)
6. Content pass: local SEO wording + service copy + disclaimers

## Open questions (please answer before we start)
1. Do you want **Next.js** (recommended for SEO) or a pure React SPA?
i give you autonamy to decide that we want full aai-seo friendly.

2. What’s the preferred primary CTA: **Call**, **Email**, or **Book a consultation**?
match the sections from the target website.

3. Do you have (or want placeholder) **phone number, email, and Saskatoon address** for NAP?
use: brand name and archana kumari as the person 
4. Any professional credentials to mention (CPA, EFILE, years in business), or should we keep it generic?

keep genreic and match the target website

5. Any must-have sections from `ahbooktax.ca` you want copied structurally (e.g., banner, testimonials, pricing, booking widget)?
tho whole idea is to copy the layout of that website but ade for us.

6. Do you need the site **single-language** (English) or English + another language?

Only english language.

## Decisions (confirmed)
- Framework: Next.js (App Router) for SEO-first SSR/SSG
- Brand name: TrustEdge Tax Services
- Location focus: Saskatoon, Saskatchewan (Canada-only)
- Contact placeholders: 306 area code phone number; booking section placeholder
- Person name on site: Archana Kumari (use initials/headshot placeholder)
- Content style: keep generic; match `ahbooktax.ca` section layout and improve with a premium “Apple-like” vibe

