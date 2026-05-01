import Link from "next/link";

export const metadata = {
  title: "Print-on-Demand QA — HarteFact",
  description:
    "Print-specific quality metrics for AI-generated designs. CMYK gamut, ink coverage, transparency edge fringing, design placement safety, and pre-generation input validation.",
};

const FRAMEWORK_VERSION = "v2.1";
const ADDENDUM_DATE = "April 2026";

const sections = [
  {
    id: "color",
    title: "1. Print-Ready Color & Ink Fidelity",
    blurb:
      "AI designs in RGB may contain colours impossible to reproduce on a shirt. The on-screen preview will look vivid; the printed shirt will look dull or wrong.",
    metrics: [
      {
        ref: "1.1",
        name: "CMYK gamut warning per printer profile",
        why: "RGB designs may contain colours outside the printer's reproducible gamut.",
        how: "Convert via the target printer's ICC profile; flag regions where Delta-E > threshold (e.g. > 6).",
      },
      {
        ref: "1.2",
        name: "Brand colour out-of-gamut flag",
        why: "Strict brand HEX values may fall outside the printer's CMYK gamut entirely.",
        how: "Compare each approved HEX to its closest in-gamut CMYK reproduction; flag any exceeding client tolerance.",
      },
      {
        ref: "1.3",
        name: "Total ink coverage check",
        why: "DTG printers cannot deposit excessive ink. Coverage above 240–280% causes bleeding, long drying, and poor hand feel.",
        how: "After CMYK conversion, sum C+M+Y+K per pixel; report the percentage of pixels exceeding the configured limit.",
      },
      {
        ref: "1.4",
        name: "Rich black vs. pure black advisory",
        why: "Pure black (0,0,0,100) can print as faded grey on some garments; rich black yields a deeper black.",
        how: "Detect large solid areas with high K and low CMY; flag as advisory (informational, not pass/fail).",
      },
    ],
  },
  {
    id: "resolution",
    title: "2. Resolution & Print Dimension Mapping",
    blurb:
      "A 1024×1024 AI image may look sharp on screen but pixelate when printed at 12×12 inches.",
    metrics: [
      {
        ref: "2.1",
        name: "Print size vs. image resolution check",
        why: "Below the printer's minimum DPI, prints become visibly pixelated.",
        how: "Effective DPI = pixels / intended print inches. Flag if below the printer minimum (e.g. 150 DPI for DTG, 300 for best quality).",
      },
      {
        ref: "2.2",
        name: "Aspect ratio mismatch warning",
        why: "Square designs forced into rectangular print areas get cropped or padded unexpectedly.",
        how: "Compare image aspect ratio to expected print area; flag if deviation exceeds a small tolerance (e.g. 2%).",
      },
    ],
  },
  {
    id: "edges",
    title: "3. Transparency & Edge Quality",
    blurb:
      "AI-generated cutouts often leave halos, fringes, or coloured spill at the subject edge — invisible on screen, ugly in print.",
    metrics: [
      {
        ref: "3.1",
        name: "Fringing / halo detection",
        why: "Halos of white or semi-transparent pixels print as a visible white border on coloured shirts.",
        how: "Dilate the alpha edge mask. For pixels where 0 < alpha < 255, measure RGB distance to white (or known background). Flag dense edge regions matching background colour.",
      },
      {
        ref: "3.2",
        name: "Semi-transparent edge pixel warning",
        why: "Soft-edge transitions from AI upscaling or background removal print unpredictably.",
        how: "Count pixels with alpha 1–254 in a narrow band (e.g. 2–3px) of the fully transparent region; flag continuous borders exceeding a threshold length.",
      },
      {
        ref: "3.3",
        name: "Background colour spill",
        why: "Removed backgrounds can bleed into the subject's edges as a coloured halo in print.",
        how: "Compare chroma (Cb/Cr) of edge pixels against subject interior and removed background. Flag edges deviating toward background chroma.",
      },
    ],
    note: "These three can be implemented as a single composite alpha-edge quality metric.",
  },
  {
    id: "input",
    title: "4. Pre-Generation Input Validation (Dimension 0)",
    blurb:
      "New gate before generation. Failing any metric here blocks generation entirely — no point QC'ing output from bad input.",
    metrics: [
      {
        ref: "4.1",
        name: "Uploaded sketch / reference image quality",
        why: "Tiny, JPEG-compressed, or blurry input produces poor AI output regardless of model.",
        how: "Check minimum resolution (e.g. 512px short side), BRISQUE, Laplacian variance for sharpness, and compression artifact detection.",
      },
      {
        ref: "4.2",
        name: "Content moderation (copyright, NSFW)",
        why: "Copyrighted logos or inappropriate imagery as input creates legal liability if printed.",
        how: "Perceptual hash comparison against trademarked logo databases (sports, brands) plus NSFW classifier on the upload.",
      },
      {
        ref: "4.3",
        name: "Watermark / stock agency logo detection",
        why: "Watermarks (Shutterstock, Getty) on input would appear on the final printed product.",
        how: "OCR for common watermark text, template matching, and perceptual hash comparison against a watermark library.",
      },
    ],
    note: "These checks happen before AI generation begins. They form Dimension 0 — Input Validation, gated as Gate 0.",
  },
  {
    id: "placement",
    title: "5. Design Placement & Print Area Safety",
    blurb:
      "Elements placed too close to the print edge get cut off or sewn into seams. Fine details may not survive DTG printing.",
    metrics: [
      {
        ref: "5.1",
        name: "Print-safe zone compliance",
        why: "Edges may be trimmed or absorbed into collar / side-seam stitching during garment production.",
        how: "Per-garment safe-zone margins (e.g. 1\" from collar, 2\" from side seams). Overlay a template mask; flag any non-transparent pixels outside the safe zone.",
      },
      {
        ref: "5.2",
        name: "Minimum detail size check",
        why: "Very fine lines or tiny text may be illegible or break apart in DTG printing.",
        how: "Measure stroke widths via morphological skeletonization and distance transform. Flag stroke widths below a configurable minimum (e.g. 1–2mm at actual print size).",
      },
    ],
  },
];

const integrationPoints = [
  {
    label: "Dimension 0 — Input Validation (new)",
    detail:
      "New gate before current Gate 1. Owns metrics 4.1, 4.2, 4.3. Failing any metric here blocks generation entirely — no point QC\u2019ing output from bad input.",
  },
  {
    label: "Dimension 1 — Technical Delivery (extended)",
    detail:
      "Owns metrics 2.1 and 2.2 as a print_specs sub-dimension, alongside the ICC profile path and file-format suitability check (PNG with alpha for transparent designs).",
  },
  {
    label: "Dimension 2 — Spatial & Texture Integrity (extended)",
    detail:
      "Owns metrics 3.1, 3.2, 3.3 as a single composite alpha-edge quality metric. These are general image-space artifacts; the same checks apply to any cutout deliverable, not just print.",
  },
  {
    label: "Dimension 8 — Brand & Client Compliance (extended)",
    detail:
      "Owns metric 1.2 (out-of-gamut brand colours) as a client-specific check, alongside existing brand HEX Delta-E scoring.",
  },
  {
    label: "Dimension 10 — Print Fidelity (new)",
    detail:
      "Owns metrics 1.1, 1.3, 1.4, 5.1, 5.2 — the print-physics-only checks (CMYK gamut, ink coverage, rich black, garment safe-zone, minimum detail size). These are meaningless on screen-only deliverables, which is why they earn a dedicated dimension rather than living inside D02.",
  },
  {
    label: "Client Configuration Table",
    detail:
      "New fields: printer_icc_profile, min_dpi, max_ink_coverage, garment_safe_zones, min_stroke_width_mm, rich_black_preference.",
  },
];

export default function PodPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
          <span>POD Addendum to Framework {FRAMEWORK_VERSION}</span>
          <span aria-hidden="true">·</span>
          <span>{ADDENDUM_DATE}</span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold text-zinc-100 md:text-5xl">
          Print-on-Demand QA
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-400">
          Print-specific metrics extending the core framework. Color fidelity
          for fabric printing, physical print constraints, transparency edge
          quality, input validation, and garment placement.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-zinc-500">
          Designed for DTG and DTF print-on-demand operators running AI-assisted
          design pipelines. Catches the failures that look fine on screen and
          look terrible on the shirt.
        </p>
      </header>

      <nav
        aria-label="Section navigation"
        className="mb-12 rounded-lg border border-border bg-surface-elevated p-4"
      >
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          On this page
        </p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-sm text-zinc-300 transition-colors hover:text-cyan-400"
              >
                {s.title}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#integration"
              className="text-sm text-zinc-300 transition-colors hover:text-cyan-400"
            >
              Integration into the framework
            </a>
          </li>
        </ul>
      </nav>

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mb-16 scroll-mt-24"
        >
          <h2 className="text-2xl font-semibold text-zinc-100">
            {section.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-zinc-400">
            {section.blurb}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {section.metrics.map((m) => (
              <div
                key={m.ref}
                className="rounded-lg border border-border bg-surface-elevated p-5 transition-colors hover:border-border-hover"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-cyan-400/70">
                    {m.ref}
                  </span>
                  <h3 className="text-base font-semibold text-zinc-100">
                    {m.name}
                  </h3>
                </div>
                <p className="mt-3 text-xs uppercase tracking-wider text-zinc-500">
                  Why it matters
                </p>
                <p className="mt-1 text-sm text-zinc-400">{m.why}</p>
                <p className="mt-3 text-xs uppercase tracking-wider text-zinc-500">
                  Technical approach
                </p>
                <p className="mt-1 text-sm text-zinc-400">{m.how}</p>
              </div>
            ))}
          </div>

          {section.note && (
            <p className="mt-4 max-w-3xl rounded-md border border-border bg-surface px-4 py-3 text-xs text-zinc-500">
              <span className="font-mono uppercase tracking-wider text-cyan-400/70">
                Note
              </span>{" "}
              · {section.note}
            </p>
          )}
        </section>
      ))}

      <section id="integration" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-semibold text-zinc-100">
          Integration into the framework
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-zinc-400">
          The addendum is incremental, not a rebuild. Of the 14 POD metrics, 6
          absorb cleanly into 3 existing dimensions (D01, D02, D08); the
          remaining 8 require 2 new dimensions — D00 for pre-generation input
          validation, D10 for print-physics-only checks.
        </p>

        <ul className="mt-6 space-y-3">
          {integrationPoints.map((p) => (
            <li
              key={p.label}
              className="rounded-lg border border-border bg-surface-elevated p-4"
            >
              <p className="text-sm font-semibold text-zinc-100">{p.label}</p>
              <p className="mt-1 text-sm text-zinc-400">{p.detail}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-lg border border-border bg-surface-elevated p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/80">
            Revised gating sequence
          </p>
          <ol className="mt-3 space-y-2 text-sm text-zinc-300">
            <li>
              <span className="font-mono text-xs text-cyan-400/70">Gate 0</span>{" "}
              — Input Validation <span className="text-zinc-500">(new)</span>
            </li>
            <li>
              <span className="font-mono text-xs text-cyan-400/70">Gate 1</span>{" "}
              — Technical + Print Specs (DPI, format, aspect ratio)
            </li>
            <li>
              <span className="font-mono text-xs text-cyan-400/70">Gate 2</span>{" "}
              — Spatial Quality + Print Fidelity (artifacts, transparency, ink)
            </li>
            <li className="text-zinc-500">
              … existing gates unchanged.
            </li>
          </ol>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface-elevated p-6">
        <h2 className="text-lg font-semibold text-zinc-100">
          POD pilot engagements
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          We&apos;re scoping a small number of pilot engagements with print-on-
          demand operators running AI-assisted design pipelines. Pilots focus on
          Dimension 0 input validation and the alpha-edge quality composite — the
          two highest-leverage POD checks.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 text-cyan-400 transition-colors hover:text-cyan-300"
        >
          Get in touch
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </section>
    </article>
  );
}
