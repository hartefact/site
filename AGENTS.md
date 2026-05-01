# AGENTS.md — Hartefact website

Single-file context for any AI agent that helps maintain this repo (Cursor, Claude Code, Codex CLI, Gemini Code, etc.). Read this first before making any changes. **Cursor users:** the same content is split across `.cursor/rules/project.mdc` and `.cursor/rules/workflow.mdc` so Cursor's rule engine surfaces it on every session — both files are kept in sync with this one.

---

## What this repo is

The public-facing marketing site for **Hartefact**, an independent QA framework and benchmarking authority for AI-generated visual content (image, video, print-on-demand). The site's job is to publish methodology, build authority, and capture pilot inquiries while the underlying QA pipeline is in active build (Phase 1). It is **not** a product surface — no auth, no DB, no API routes, no user accounts.

## Brand canon

- **In running prose, metadata, page copy, alt text, code identifiers, comments, agent output:** `Hartefact` (lowercase `f`).
- **In the wordmark/logo image** (`public/logo/hartefact_wordmark.png`): the visual rendering is `HarteFact` (capital `F`). The image is approved as-is. Don't try to "fix" the casing of the image; the dual convention is intentional — the wordmark is a logotype, the prose is a name.
- The descriptor `for the Digital Visual Arts` is a tagline, not part of the name.
- The legacy form `HarteFact Digital` is deprecated everywhere except: (a) the legal entity name, (b) the source-folder name on disk (`Hartefact_Digital/`), (c) historical/transitional notes that explicitly reference the rename. Do not introduce it in new copy.
- Aliases for parsing: `HarteFact`, `HarteFact Digital`, `Hartefact Digital` all refer to the same entity. **Always render as `Hartefact` in new prose.**

## Stack

- Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion (subtle animation only)
- Static-rendered pages — no CMS, no DB, no auth, no API routes in Phase 1
- Hosted on Vercel; CI is "git push to main"

## File map

| Path | What it is |
| --- | --- |
| `app/page.tsx` | Homepage — hero + use-cases teaser + framework summary |
| `app/methodology/page.tsx` | The nine-dimension framework, three gates |
| `app/use-cases/page.tsx` | Index of audiences (creators, studios, POD); designed to scale |
| `app/pod/page.tsx` | Print-on-demand addendum (linked from `/use-cases`, not the nav) |
| `app/gallery/page.tsx` | Examples — will become "Scorecards" once per-asset scoring ships |
| `app/contact/page.tsx` | Mailto-only pilot inquiries, no backend |
| `components/layout/{Navbar,Footer}.tsx` | Site chrome |
| `components/hero/HeroSection.tsx` | Hero with wordmark image |
| `components/home/{IntroSection,UseCasesSection}.tsx` | Homepage sections |
| `data/galleryImages.ts` | Gallery data (placeholder; replace with real outputs) |
| `docs/ai-video-qa-framework.md` | Public copy of the framework spec mirrored from the Obsidian vault |
| `public/logo/` | Site-used logo assets (transparent backgrounds) |
| `src/components/*.png` | Source logo assets pre-background-removal |

## Content conventions

- Use **dimensions**, never "domains". Nine dimensions, three gates. Codes are `D00`–`D08`.
- POD addendum metrics map onto existing dimensions where possible (`D00`, `D01`, `D02`, `D08`, `D10`); see `app/pod/page.tsx`.
- Voice: dry, technical, authority-first. Anti-patterns: marketing exclamation, "AI-powered", "revolutionary", "game-changing".
- New verticals (VFX, arch-viz, music video, etc.) land as `/use-cases` cards first, then earn an addendum page (`/<vertical>`) only if the metric set is genuinely distinct.
- A new idea earns a section before a page; a new page earns its place before a nav slot.

## Source-of-truth doc

The canonical framework spec lives in the Obsidian vault at `Projects/Hartefact/Hartefact - Complete AI Video & Image Quality Assurance Framework.md`. The public methodology page is a derivation. When the spec and the site disagree, the spec wins; update the site to match.

---

## Workflow — git, GitHub, Vercel

### Where things live

- **Repo:** https://github.com/hartefact/site (public, owned by the `hartefact` GitHub Organization).
- **Host:** Vercel — scope `reid-hartes-projects`, project `site`, Hobby tier.
- **Production URL (public):** https://site-reid-hartes-projects.vercel.app
- **Custom domain:** not yet — add `hartefact.com` under Vercel → Project → Settings → Domains once registered.
- **Per-deploy unique URLs** like `https://site-<hash>-reid-hartes-projects.vercel.app` are gated by Vercel auth and **return 401** to anonymous visitors. Always link the production alias above (or a future custom domain), never the unique URL.

### Push-to-deploy lifecycle

- Push to `main` → Vercel auto-builds and replaces production within ~60 seconds.
- Push to any other branch (or open a PR) → Vercel auto-builds a **preview** at its own URL, also gated by Vercel auth (private to the team). Use previews for risky visual or copy changes.
- Build/install/output dirs are auto-detected from Next.js. **Do not add `vercel.json`** unless you have a specific reason.
- Verify a deploy succeeded:
  ```bash
  gh api repos/hartefact/site/deployments \
    --jq '.[0:3] | .[] | {sha,env: .environment, created: .created_at}'
  # Then for the deployment id of interest:
  gh api repos/hartefact/site/deployments/<id>/statuses \
    --jq '.[] | {state, env_url, created: .created_at}'
  ```

### Branching for non-trivial changes

```bash
git checkout -b feat/<short-slug>
# ... make changes, commit ...
git push -u origin feat/<short-slug>
# Vercel posts a preview URL on the PR within ~60s
# Merge via PR when preview looks right; deletion of the branch is fine
```

For one-line copy fixes, committing straight to `main` is acceptable for now — branch protection isn't enabled yet. Once it is, all changes go through PRs.

### Revert / rollback playbook

In **rough order of preference** (least invasive first):

1. **Vercel one-click rollback** (fastest, no git churn, ~10 seconds):
   Vercel dashboard → project `site` → Deployments → find the last-known-good deploy → `…` menu → **"Promote to Production"**. Production URL flips immediately. The bad commit stays in git history; fix it in a follow-up.

2. **`git revert`** (preferred for code: keeps history honest, triggers a fresh deploy):
   ```bash
   git revert <bad-sha>     # creates an inverse commit, prompts for message
   git push origin main     # triggers a clean revert deploy
   ```

3. **`git reset --hard <good-sha>` then `git push --force`** — **DO NOT USE** unless the bad commit hasn't been pushed yet, or you've explicitly decided to rewrite shared history. It is destructive and not recoverable from the GitHub UI.

If you broke production *and* the local working tree, the recovery sequence is: (a) Vercel one-click rollback to restore the live site immediately, then (b) `git reflog` locally to find the last-known-good local commit, then (c) `git revert` the bad change cleanly.

### Hygiene

- Never commit `.env*`, credentials, or anything in `node_modules` or `.next` — `.gitignore` covers these.
- Run `npm run lint` and `npm run build` locally before pushing anything that touches more than copy.
- Linter errors block the Vercel build (`next build` fails on lint errors by default).
- The `package.json` `name` field is `hartefact` (lowercase). Do not change.

### Acting on production

- A Cursor or other agent operating on the host has write access to this repo via the host's `gh` CLI. Agent commits write as the host's git identity, not as a separate "Cursor" user. Treat agent commits as your own.
- Agents should **not** disable Vercel deployment protection programmatically, run `vercel` CLI commands, or change Vercel project settings — those are dashboard actions for the human owner.
