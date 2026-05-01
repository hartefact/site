import Link from "next/link";

export const metadata = {
  title: "Contact — HarteFact",
  description:
    "Pilot inquiries, methodology questions, and engagement requests for the HarteFact QA framework.",
};

const CONTACT_EMAIL = "hello@hartefact.com";
const SUBJECT = "HarteFact — Pilot inquiry";

const targets = [
  {
    title: "Production studios & agencies",
    detail:
      "Running AI generation in volume and need consistent, documentable QC. Managed-service pilots scoped per-asset with a session minimum.",
  },
  {
    title: "Print-on-demand operators",
    detail:
      "DTG / DTF pipelines with AI-assisted design steps. Pilots focus on Dimension 0 input validation and the alpha-edge composite metric.",
  },
  {
    title: "Brands & compliance teams",
    detail:
      "Brand-palette and talent-likeness verification on AI-generated content. Per-client configuration with versioned scorecards.",
  },
  {
    title: "Marketplaces & platforms",
    detail:
      "Bulk evaluation of generated content. API-style engagements (in design) once Phase 1 ships.",
  },
];

export default function ContactPage() {
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(SUBJECT)}`;

  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-semibold text-zinc-100 md:text-5xl">
          Get in touch
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          We&apos;re scoping a small number of pilot engagements through the
          second half of 2026. Methodology questions and collaboration
          inquiries also welcome.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-surface-elevated p-6">
        <p className="text-xs uppercase tracking-wider text-cyan-400/80 font-mono">
          Email
        </p>
        <a
          href={mailto}
          className="mt-2 block break-all text-2xl font-semibold text-zinc-100 transition-colors hover:text-cyan-400"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="mt-3 text-sm text-zinc-500">
          When inquiring about a pilot, a one-paragraph description of your
          generation pipeline and weekly asset volume is the fastest way to a
          useful first reply.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-zinc-100">
          Who we&apos;re talking to right now
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {targets.map((t) => (
            <div
              key={t.title}
              className="rounded-lg border border-border bg-surface-elevated p-5"
            >
              <h3 className="text-base font-semibold text-zinc-100">
                {t.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">{t.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-lg border border-border bg-surface-elevated p-6">
        <h2 className="text-lg font-semibold text-zinc-100">Build status</h2>
        <ul className="mt-4 space-y-2 text-sm text-zinc-400">
          <li className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-cyan-400/70">Phase 1</span>
            <span>Technical Delivery Compliance — in active build.</span>
          </li>
          <li className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-cyan-400/70">Phase 1b</span>
            <span>
              Identity Consistency Spike (InsightFace) — scheduled alongside
              Phase 1.
            </span>
          </li>
          <li className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-zinc-500">Next</span>
            <span>
              First public benchmarks — methodology + initial results published
              before exhaustive coverage.
            </span>
          </li>
        </ul>
        <p className="mt-4 text-xs text-zinc-500">
          See the{" "}
          <Link
            href="/methodology"
            className="text-cyan-400/80 underline-offset-4 hover:underline hover:text-cyan-300"
          >
            methodology
          </Link>{" "}
          for the full dimension breakdown and gating sequence.
        </p>
      </section>
    </article>
  );
}
