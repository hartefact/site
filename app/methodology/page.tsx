import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Methodology — HarteFact",
  description:
    "Model-agnostic QA framework for AI-generated visual content. Nine dimensions, three gates, automated scorecards. Local-first, open-source, no cloud dependencies.",
};

const FRAMEWORK_VERSION = "v2.1";
const LAST_UPDATED = "April 2026";

const dimensions = [
  {
    id: 1,
    name: "Technical Delivery Compliance",
    summary:
      "File specs, codecs, container, color space, VMAF, audio packaging. The non-negotiable foundation.",
    examples: ["Resolution / frame rate", "Codec & container", "VMAF score", "Color space"],
    phase: "Phase 1",
  },
  {
    id: 2,
    name: "Spatial & Texture Integrity",
    summary:
      "Per-frame visual quality. Compression artifacts, texture noise, banding, VAE seam detection.",
    examples: ["BRISQUE / NIQE", "Laplacian sharpness", "Color banding", "Wavelet noise analysis"],
    phase: "Phase 2",
  },
  {
    id: 3,
    name: "Temporal Consistency & Motion",
    summary:
      "Stability across frames. Background flicker, optical flow consistency, scene-cut detection.",
    examples: ["Background SSIM", "Optical flow", "Flicker detection", "Scene cuts"],
    phase: "Phase 3",
  },
  {
    id: 4,
    name: "Audio Quality",
    summary:
      "Loudness, clipping, sync offset. Runs in parallel with the temporal pipeline.",
    examples: ["LUFS measurement", "Clipping detection", "Sync offset", "Spectral integrity"],
    phase: "Phase 4",
  },
  {
    id: 5,
    name: "Lip Sync Precision",
    summary:
      "Combines mouth aspect ratio (MAR) with audio phoneme timing via DTW alignment.",
    examples: ["MAR extraction", "DTW alignment", "WhisperX phonemes", "Sync drift over time"],
    phase: "Phase 5",
  },
  {
    id: 6,
    name: "Character & Identity Integrity",
    summary:
      "Face identity drift, hand failures, body proportions, teeth, clothing consistency.",
    examples: ["InsightFace cosine similarity", "Hand failure logging", "Body proportions", "Skin tone stability"],
    phase: "Phase 6",
  },
  {
    id: 7,
    name: "Lighting & Scene Integrity",
    summary:
      "Shadow coherence, luminance tracking, color temperature stability, reflection plausibility.",
    examples: ["Shadow masking", "Luminance per region", "Color temperature drift", "Reflection flagging"],
    phase: "Phase 7",
  },
  {
    id: 8,
    name: "Brand & Client Compliance",
    summary:
      "Per-client palette, talent reference, logo placement, LUT comparison, typography.",
    examples: ["Brand HEX Delta-E", "Talent face match", "LUT comparison", "Logo / wordmark presence"],
    phase: "Phase 8",
  },
  {
    id: 9,
    name: "Prompt & Action Adherence",
    summary:
      "VLM-evaluated framing, composition, physics plausibility, object/spatial flagging.",
    examples: ["VLM scene description", "Framing & composition", "Physics flags", "Slideshow detection"],
    phase: "Phase 9",
    aiEvaluated: true,
  },
];

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
          <span>Framework {FRAMEWORK_VERSION}</span>
          <span aria-hidden="true">·</span>
          <span>Last updated {LAST_UPDATED}</span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold text-zinc-100 md:text-5xl">
          Methodology
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-400">
          A model-agnostic framework for measuring the quality of AI-generated
          images and video. Nine dimensions, three gates, automated scorecards.
        </p>
        <p className="mt-3 max-w-3xl text-sm italic text-zinc-500">
          In video QA, &ldquo;artifact&rdquo; often names a defect. HarteFact
          scores outputs anyway — assets, streams, pixels, facts.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-zinc-500">
          Local-first. No cloud dependencies. Designed to run on Apple Silicon
          using open-source components. The framework is incremental — each
          phase produces infrastructure consumed by later phases.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-zinc-100">Core principles</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-semibold text-cyan-400">
              Model-agnostic by design
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Most metrics measure properties of the output file — resolution,
              texture, temporal stability, color accuracy, identity consistency
              — regardless of which model produced it. Scoring does not require
              recalibration when models change.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-semibold text-cyan-400">
              Algorithmic vs. AI-evaluated
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Every score is labeled <code className="font-mono text-xs">algorithmic</code>{" "}
              or <code className="font-mono text-xs">ai_evaluated</code>. VLM
              scores are reported with mean and variance and are never presented
              as equivalent to deterministic metrics.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-semibold text-cyan-400">
              Tiered gating
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Three gates avoid wasting compute on content that has already
              failed. A clip with the wrong codec never consumes GPU cycles on
              identity-drift analysis.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-semibold text-cyan-400">
              Versioned, reproducible
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Every run logs framework version, calibration version, and model
              versions. Re-evaluations are new runs, not silent replacements.
              Score history is queryable per asset.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-zinc-100">
          Pipeline architecture
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-zinc-400">
          Three gates separate fast, cheap checks from expensive deep analysis.
          Failed content gets immediate, specific feedback identifying the
          failure dimension — without the cost of downstream scoring.
        </p>

        <div className="mt-8 overflow-hidden rounded-lg border border-border bg-surface-elevated">
          <ol className="divide-y divide-border">
            <PipelineStep
              gate="Gate 1"
              title="Technical specs"
              detail="Pass / fail on file specs, codec, resolution, audio packaging."
              dimensions="Dimension 1"
            />
            <PipelineStep
              gate="Gate 2"
              title="Spatial quality"
              detail="Pass / fail on catastrophic spatial failures (severe artifacts, banding)."
              dimensions="Dimension 2"
            />
            <PipelineStep
              gate="Gate 3"
              title="Temporal & audio basics"
              detail="Pass / fail on flicker, scene-cut sanity, audio levels, sync offset."
              dimensions="Dimensions 3 + 4 (parallel)"
            />
            <PipelineStep
              gate="Deep"
              title="Identity, lighting, brand, prompt adherence"
              detail="Per-character analysis, scene integrity, client-compliance scoring."
              dimensions="Dimensions 5 – 9"
            />
            <li className="bg-surface px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-wider text-cyan-400/80">
                  Output
                </span>
                <span className="text-sm font-medium text-zinc-100">
                  Versioned scorecard
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Pass/fail summary, per-dimension detail, annotated frame
                thumbnails, timeline visualization, per-frame metric trends,
                client threshold reference.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-zinc-100">
          The nine dimensions
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-zinc-400">
          Each dimension owns a distinct axis of output quality. Build phases
          follow the dependency map: each phase produces infrastructure later
          phases reuse, so no work is thrown away.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {dimensions.map((d) => (
            <div
              key={d.id}
              className="rounded-lg border border-border bg-surface-elevated p-5 transition-colors hover:border-border-hover"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-cyan-400/70">
                    D{d.id.toString().padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold text-zinc-100">
                    {d.name}
                  </h3>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  {d.phase}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{d.summary}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {d.examples.map((ex) => (
                  <li
                    key={ex}
                    className="rounded border border-border px-2 py-0.5 font-mono text-[10px] text-zinc-500"
                  >
                    {ex}
                  </li>
                ))}
              </ul>
              {d.aiEvaluated && (
                <p className="mt-3 text-xs text-amber-400/80">
                  Includes <code className="font-mono">ai_evaluated</code>{" "}
                  scores; reported with mean + variance.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-zinc-100">
          What this framework is not
        </h2>
        <ul className="mt-6 space-y-3 text-sm text-zinc-400">
          <li className="flex gap-3">
            <span className="text-zinc-600">—</span>
            <span>
              Not a scoring rubric for taste, creativity, or commercial appeal.
              Aesthetic judgment remains human.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-zinc-600">—</span>
            <span>
              Not a model leaderboard. The framework benchmarks{" "}
              <em>output properties</em>; model comparisons are a separate
              activity built on top of the same infrastructure.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-zinc-600">—</span>
            <span>
              Not a SaaS dashboard. Phase 1 ships a local pipeline and a
              versioned scorecard format, not a hosted product.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-zinc-600">—</span>
            <span>
              Not a substitute for human QC on edge cases. The system is
              designed to scale review, not to replace the final sign-off on
              high-stakes deliverables.
            </span>
          </li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-zinc-100">
          Print-on-demand extension
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-zinc-400">
          A separate addendum extends the framework with print-specific quality
          metrics: CMYK gamut warnings, ink coverage limits, transparency edge
          fringing, design placement safety, and pre-generation input
          validation.
        </p>
        <Link
          href="/pod"
          className="mt-4 inline-flex items-center gap-2 text-cyan-400 transition-colors hover:text-cyan-300"
        >
          Read the POD addendum
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

      <section className="rounded-lg border border-border bg-surface-elevated p-6">
        <div className="flex items-start gap-3">
          <Image
            src="/logo/funnel_logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Pilot engagements
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Phase 1 (Technical Delivery) and Phase 1b (Identity Consistency)
              are in active build. We&apos;re scoping a small number of pilot
              engagements with production studios, agencies, and POD operators
              for the second half of 2026.
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
          </div>
        </div>
      </section>
    </article>
  );
}

function PipelineStep({
  gate,
  title,
  detail,
  dimensions,
}: {
  gate: string;
  title: string;
  detail: string;
  dimensions: string;
}) {
  return (
    <li className="px-6 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400/80">
            {gate}
          </span>
          <span className="text-sm font-medium text-zinc-100">{title}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          {dimensions}
        </span>
      </div>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </li>
  );
}
