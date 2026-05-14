# Hartefact — Phase 1

The public-facing site for **Hartefact** — *Quality Management Tools and Benchmarking for the Digital Visual Arts*. The business is an independent QA framework and benchmarking authority for AI-generated visual content (image, video, and print-on-demand). Copy on the site stresses **what breaks in real AI deliverables** (spec drift, temporal and sync issues, identity drift, etc.) and how the framework catches those failures **before handoff**. The site's near-term job is to **publish methodology, build authority, and capture pilot inquiries** while the underlying QA pipeline is in active build (Phase 1).

> **Naming note.** The brand was repositioned from the legacy **HarteFact Digital** form in April 2026 — the "Digital" piece now lives only in the tagline ("for the Digital Visual Arts"). **In prose, metadata, and page copy, use `Hartefact` (lowercase `f`), not the logotype casing `HarteFact`.** The homepage wordmark image is still the approved **HarteFact** logotype; that dual convention is intentional. The legal entity name and the on-disk folder (`Hartefact_Digital/`) may still reference older casing.

**Canonical project docs (use these for all work on this repo):**
- **Framework spec:** vault `Projects/Hartefact/Hartefact Digital - Complete AI Video & Image Quality Assurance Framework.md` — nine dimensions (originally drafted as "domains"), three gates, build sequence
- **POD addendum:** the print-on-demand metrics extension covering CMYK gamut, ink coverage, alpha-edge fringing, design placement, input validation
- **Project context:** `src/docs/project-context.md..rtf` — mission, goals, audience, stack, content types
- **Design intent:** `src/docs/design-intent.rtf` — visual philosophy, layout, typography, motion, anti-patterns

## For agents (Cursor, Claude Code, Codex, etc.)

Before touching this repo, read [`AGENTS.md`](AGENTS.md) — it has the brand canon, file map, content conventions, and the full git/GitHub/Vercel workflow including the revert playbook. Cursor users get the same content automatically via [`.cursor/rules/project.mdc`](.cursor/rules/project.mdc) and [`.cursor/rules/workflow.mdc`](.cursor/rules/workflow.mdc) on every session — those files and `AGENTS.md` are kept in sync.

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (subtle animation only)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Before pushing substantive changes:

```bash
npm run lint   # eslint (Next.js 16+; there is no `next lint` subcommand anymore)
npm run build
```

## Deploys

- **Repo:** https://github.com/hartefact/site (public, owned by the `hartefact` GitHub Organization).
- **Host:** Vercel (Hobby tier, scope `reid-hartes-projects`, project `site`).
- **Production URL (canonical, public):** **https://hartefact.org**
- **`www.hartefact.org`** 301-redirects to the apex.
- **Vercel-assigned alias:** `https://site-reid-hartes-projects.vercel.app` still resolves; the canonical URL is `hartefact.org`.
- **Defensive domain:** `hartefact.dev` is also registered and URL-forwards to `hartefact.org`; reserved for future technical sub-properties (`docs.hartefact.dev`, etc.).
- **Workflow:**
  - Pushes to `main` → automatic production deploy at `hartefact.org` within ~60s.
  - Pushes to any other branch / PR → automatic preview deploy on its own URL (gated by Vercel auth).
  - Build command, install command, and output dir are auto-detected from Next.js — no `vercel.json` needed for Phase 1.
- **Deployment protection:** Disabled for production (the site is publicly browseable). Preview deploys remain gated by Vercel auth, which is the right default. Re-enable on production via **Project → Settings → Deployment Protection → Vercel Authentication** if you ever want a soft-launch window.
- **Custom domain (live):** Apex `hartefact.org` is connected to the project as the production environment; `www.hartefact.org` is a 301 redirect to the apex. DNS is at Porkbun:
  - Apex: `A @ → 216.198.79.1`
  - www: `CNAME www → ef07e185bf0f4370.vercel-dns-017.com.`
  - SSL is auto-provisioned by Vercel (Let's Encrypt). No `vercel.json` or registrar nameserver change needed; Porkbun stays the DNS provider.

## Logos

- **Source assets:** `src/components/funnel_logo.png`, `src/components/name_logo.png`, `src/components/hartefact_wordmark.png`
- **Transparent outputs:** `public/logo/` (used by the site). To regenerate after editing source PNGs, run:
  ```bash
  node scripts/remove-logo-backgrounds.mjs
  ```
- **Usage:** Funnel = navbar, footer, and app icon (favicon). `name_logo.png` is the legacy **HARTEFACT DIGITAL** wordmark and should be kept as the original asset. `hartefact_wordmark.png` is the corrected cropped single-word logotype (visually **HarteFact**; see naming note above) from `/Users/reidharte/Downloads/HarteFact Digital logo_cropped.png` and is used by the homepage hero.
- App favicon is set from the funnel logo (`app/icon.png`).

## Structure

- `app/page.tsx` — Homepage shell (composes the sections below)
- `components/hero/HeroSection.tsx` — Hero: wordmark, supporting taglines (including plain-language grounding for what goes wrong with AI video/image outputs)
- `components/home/UseCasesSection.tsx` — Home teaser for two primary audiences; links to `/use-cases` for the full list
- `components/home/IntroSection.tsx` — Framework intro (nine dimensions, three gates, gated pipeline copy) + dimension grid
- `app/methodology/page.tsx` — QA framework overview (nine dimensions, three gates)
- `app/use-cases/page.tsx` — Use-cases index (creators, studios, POD; frames the same framework against three pain points; designed to scale as new addendums and audiences land)
- `app/pod/page.tsx` — Print-on-demand addendum (color, ink, edges, input validation, placement) — linked from `/use-cases`
- `app/gallery/page.tsx` — Examples (still routed at **`/gallery`**; navbar label unchanged). Structured page: Gate 1 UI screenshot, HTML batch report sample, workflow video placeholder. When per-asset scorecards ship, this page may become **Scorecards** and/or move to **`/scorecards`**.
- `app/contact/page.tsx` — Pilot inquiries (mailto-based, no backend)
- `public/examples/` — Live marketing examples committed to repo: **`ui-scorecard.png`**, **`sample-report.html`**, plus **`README.txt`** documenting any assets operators must supply before deploy
- `components/layout/` — Navbar, Footer
- `components/hero/BrandTitle3D.tsx` — Unused fallback CSS wordmark

### Information architecture

- **Methodology** is the spine — model-agnostic, versioned, doesn't change. Page copy leads with whether outputs are **deliverable** (technical, perceptual, commercial) before diving into dimensions and gates.
- **Use cases** is a growing index framed as **the same QA framework applied to different pain points**. POD is one card today; future verticals (VFX, architectural viz, music video, etc.) land here as additional cards and, where warranted, dedicated addendum pages.
- A new idea earns a section before a page; a new page earns its place before a nav slot.

## Phase 1 scope (current)

- Premium dark-mode marketing site aligned to the QA-framework positioning
- Methodology page summarizing the framework (versioned)
- Use-cases index page with three audiences (creators, studios, POD); designed to extend
- POD addendum page (separate URL for SEO + linkability), linked from `/use-cases`
- Examples page (`/gallery`, nav label **Examples**): Streamlit screenshot, self-contained single-file HTML batch report sample (`sample-report.html`, no login or install required), workflow video placeholder; future per-asset scorecards may supersede or augment this route
- Mailto-based contact for pilot inquiries
- Accessible (keyboard, ARIA, focus management)
- No auth, CMS, blog, or backend

## Future

When Phase 1 + 1b of the QA pipeline ship and first benchmarks publish, add:
- `/benchmarks` — model-by-model scorecard results
- Per-asset scorecard rendering (likely evolving the current Examples route `/gallery` or adding `/scorecards`)
- Newsletter / RSS for benchmark publication cadence

Deferred until product/service revenue justifies them: pricing page, dashboards, accounts, API docs, blog.

## Contact email

`app/contact/page.tsx` uses `hello@hartefact.org` (the real inbound address). Email forwarding is configured at Porkbun: `hello@`, `reid@`, and the `*@` catch-all all forward to the owner's Gmail. To change the public address, update the `CONTACT_EMAIL` constant in that file.

**Defensive domains:** `hartefact.org` is the canonical apex; `hartefact.dev` is also registered (URL-forwards to the apex today, reserved for future technical sub-properties). `hartefact.com` is taken on the secondary market and was not pursued — the framework's authority surface is `hartefact.org`.
