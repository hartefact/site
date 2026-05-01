# HarteFact — Phase 1

The public-facing site for **HarteFact — Quality Management Tools and Benchmarking for the Digital Visual Arts**. The business is an independent QA framework and benchmarking authority for AI-generated visual content (image, video, and print-on-demand). The site's near-term job is to **publish methodology, build authority, and capture pilot inquiries** while the underlying QA pipeline is in active build (Phase 1).

> **Naming note.** The brand was rebranded from "HarteFact Digital" to **HarteFact** in April 2026 — the descriptive "Digital" suffix moved into the tagline ("for the Digital Visual Arts"), where it reads as descriptor rather than dated agency-style filler. The legal entity name and source repo folder may still reference the old form; only customer-facing surfaces were updated.

**Canonical project docs (use these for all work on this repo):**
- **Framework spec:** `Hartefact Digital - Complete AI Video & Image Quality Assurance Framework.md` (in the Obsidian vault) — nine dimensions (originally drafted as "domains"), three gates, build sequence
- **POD addendum:** the print-on-demand metrics extension covering CMYK gamut, ink coverage, alpha-edge fringing, design placement, input validation
- **Project context:** `src/docs/project-context.md..rtf` — mission, goals, audience, stack, content types
- **Design intent:** `src/docs/design-intent.rtf` — visual philosophy, layout, typography, motion, anti-patterns

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (subtle animation only)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploys

- **Repo:** https://github.com/hartefact/site (public, owned by the `hartefact` GitHub Organization).
- **Host:** Vercel (Hobby tier, scope `reid-hartes-projects`, project `site`).
- **Production URL:** https://site-reid-hartes-projects.vercel.app
- **Workflow:**
  - Pushes to `main` → automatic production deploy.
  - Pushes to any other branch / PR → automatic preview deploy on its own URL.
  - Build command, install command, and output dir are auto-detected from Next.js — no `vercel.json` needed for Phase 1.
- **Deployment protection:** New Hobby projects ship with Vercel Authentication enabled, which puts the live site behind Vercel SSO (HTTP 401 for anonymous visitors). To make the site publicly browseable, in the Vercel dashboard go to **Project → Settings → Deployment Protection → Vercel Authentication** and set it to **Disabled** (or scope it to "Only Preview Deployments" if you want the production URL public but previews gated). Re-enable any time before launch if you want a soft-launch window.
- **Custom domain (later):** when `hartefact.com` is registered, add it under **Project → Settings → Domains** and point the registrar's DNS at Vercel; production deploys will then serve from the apex domain automatically.

## Logos

- **Source assets:** `src/components/funnel_logo.png`, `src/components/name_logo.png`, `src/components/hartefact_wordmark.png`
- **Transparent outputs:** `public/logo/` (used by the site). To regenerate after editing source PNGs, run:
  ```bash
  node scripts/remove-logo-backgrounds.mjs
  ```
- **Usage:** Funnel = navbar, footer, gallery header, app icon. `name_logo.png` is the legacy **HARTEFACT DIGITAL** wordmark and should be kept as the original asset. `hartefact_wordmark.png` is the corrected cropped single-word **HarteFact** mark from `/Users/reidharte/Downloads/HarteFact Digital logo_cropped.png` and is used by the homepage hero.
- App favicon is set from the funnel logo (`app/icon.png`).

## Structure

- `app/page.tsx` — Homepage (hero + use-cases teaser + framework summary)
- `app/methodology/page.tsx` — QA framework overview (nine dimensions, three gates)
- `app/use-cases/page.tsx` — Use-cases index (creators, studios, POD; data-driven, designed to scale as new addendums and audiences land)
- `app/pod/page.tsx` — Print-on-demand addendum (color, ink, edges, input validation, placement) — linked from `/use-cases`
- `app/gallery/page.tsx` — Examples (sample outputs today; rename to "Scorecards" once per-asset scorecards ship)
- `app/contact/page.tsx` — Pilot inquiries (mailto-based, no backend)
- `components/layout/` — Navbar, Footer
- `components/hero/` — HeroSection (image wordmark in hero), BrandTitle3D (unused fallback CSS wordmark)
- `components/home/UseCasesSection.tsx` — Home teaser for two primary audiences; links to `/use-cases` for the full list
- `components/home/IntroSection.tsx` — Framework intro + nine-dimension grid
- `components/gallery/` — GalleryGrid, GalleryItem, LightboxViewer, ImageLoader
- `data/galleryImages.ts` — Gallery data (replace with real assets)

### Information architecture

- **Methodology** is the spine — model-agnostic, versioned, doesn't change.
- **Use cases** is a growing index. POD is one card today; future verticals (VFX, architectural viz, music video, etc.) land here as additional cards and, where warranted, dedicated addendum pages.
- A new idea earns a section before a page; a new page earns its place before a nav slot.

## Phase 1 scope (current)

- Premium dark-mode marketing site aligned to the QA-framework positioning
- Methodology page summarizing the framework (versioned)
- Use-cases index page with three audiences (creators, studios, POD); designed to extend
- POD addendum page (separate URL for SEO + linkability), linked from `/use-cases`
- Examples gallery (sample outputs; future versions will display per-asset scorecards and the page will be renamed to "Scorecards")
- Mailto-based contact for pilot inquiries
- Accessible (keyboard, ARIA, focus management)
- No auth, CMS, blog, or backend

## Future

When Phase 1 + 1b of the QA pipeline ship and first benchmarks publish, add:
- `/benchmarks` — model-by-model scorecard results
- Per-asset scorecard rendering on the gallery page
- Newsletter / RSS for benchmark publication cadence

Deferred until product/service revenue justifies them: pricing page, dashboards, accounts, API docs, blog.

## Contact email

`app/contact/page.tsx` uses a placeholder `hello@hartefact.com`. Update the `CONTACT_EMAIL` constant in that file (and any future locations) to the real inbound address before going public.

**Domain action item:** the placeholder assumes `hartefact.com`. If that domain is not yet owned, register it (plus defensive `.io` / `.co` / `.dev`) before public launch. The previously-referenced `hartefactdigital.com` can stay as a forwarding origin if already owned.
