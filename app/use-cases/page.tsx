import Link from "next/link";

export const metadata = {
  title: "Use cases — HarteFact",
  description:
    "How the HarteFact QA framework shows up in real workflows: creators and their clients, studios with high-volume pipelines, and print-on-demand operators.",
};

type UseCase = {
  id: string;
  audience: string;
  status: string;
  title: string;
  blurb: string;
  highlights: { from: string; to: string }[];
  href: string;
  ctaLabel: string;
};

const useCases: UseCase[] = [
  {
    id: "creators",
    audience: "Creators & their clients",
    status: "Core framework",
    title: "Objective acceptance criteria",
    blurb:
      "Stop arguing about whether the AI output is good enough. Score the deliverable against agreed thresholds and ship the scorecard alongside it. Both sides see exactly what passed, what didn't, and why.",
    highlights: [
      { from: "Subjective sign-off", to: "Documented pass / fail" },
      { from: "Scope-creep arguments", to: "Threshold-anchored revisions" },
      { from: "\u201CIt looks off\u201D", to: "\u201CFrame 47 failed identity at 0.78\u201D" },
    ],
    href: "/methodology",
    ctaLabel: "Read the methodology",
  },
  {
    id: "studios",
    audience: "Studios & high-volume pipelines",
    status: "Core framework",
    title: "Automated batch vetting & culling",
    blurb:
      "Score every generation in a batch automatically. Reject obvious failures \u2014 wrong codec, severe artifacts, identity drift \u2014 at the gate, before they ever reach a reviewer. Humans see only the assets worth their time.",
    highlights: [
      { from: "1,000 generations", to: "The 50 worth reviewing" },
      { from: "Manual triage", to: "Automated gating" },
      { from: "\u201CSomething looks bad\u201D", to: "Frame-level flags with bounding boxes" },
    ],
    href: "/methodology",
    ctaLabel: "Read the methodology",
  },
  {
    id: "print-on-demand",
    audience: "Print-on-demand operators",
    status: "Addendum v2.1",
    title: "Print-specific QA for AI-generated designs",
    blurb:
      "CMYK gamut, ink coverage, transparency edges, pre-generation input validation, and garment placement safety. Catches the failures that look fine on screen and look terrible on the shirt.",
    highlights: [
      { from: "Vivid on screen", to: "In-gamut on fabric" },
      { from: "Sharp at 1024px", to: "Sharp at 12 inches" },
      { from: "Clean cutout preview", to: "No halo on the print" },
    ],
    href: "/pod",
    ctaLabel: "Read the POD addendum",
  },
];

export default function UseCasesPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/80">
          Use cases
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-zinc-100 md:text-5xl">
          How the framework shows up in real workflows
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-400">
          The methodology is the spine — a model-agnostic scoring framework
          that doesn&apos;t change. Use cases are how that spine gets applied
          to specific audiences and verticals.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-zinc-500">
          New addendums and audiences land here as they emerge. If your
          workflow isn&apos;t represented yet, that&apos;s usually an
          invitation to talk.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {useCases.map((uc) => (
          <section
            key={uc.id}
            id={uc.id}
            className="flex flex-col rounded-xl border border-border bg-surface-elevated p-6 transition-colors hover:border-border-hover"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                {uc.audience}
              </p>
              <span className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan-400/80">
                {uc.status}
              </span>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-zinc-100">
              {uc.title}
            </h2>
            <p className="mt-3 text-sm text-zinc-400">{uc.blurb}</p>

            <ul className="mt-5 space-y-2">
              {uc.highlights.map(({ from, to }) => (
                <li
                  key={from}
                  className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs"
                >
                  <span className="text-zinc-500 line-through decoration-zinc-700">
                    {from}
                  </span>
                  <span className="text-zinc-600" aria-hidden="true">
                    &rarr;
                  </span>
                  <span className="font-mono text-cyan-400/90">{to}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex-1" />
            <Link
              href={uc.href}
              className="inline-flex items-center gap-2 text-cyan-400 transition-colors hover:text-cyan-300"
            >
              {uc.ctaLabel}
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
        ))}
      </div>

      <section className="mt-16 rounded-lg border border-border bg-surface-elevated p-6">
        <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/80">
          Don&apos;t see your workflow?
        </p>
        <h2 className="mt-2 text-lg font-semibold text-zinc-100">
          Pilot inquiries welcome
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          The framework is designed to extend. New verticals — VFX, game
          cinematics, architectural visualization, music video, anything else
          AI-assisted — typically land as addendums to the core methodology.
          If your team is fighting trial-and-error friction with AI
          deliverables, that&apos;s the conversation.
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
