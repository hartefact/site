"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Contrast = { from: string; to: string };

type UseCase = {
  audience: string;
  title: string;
  body: string;
  contrast: Contrast[];
};

const useCases: UseCase[] = [
  {
    audience: "Creators & their clients",
    title: "Objective acceptance criteria",
    body: "Stop arguing about whether the AI output is good enough. Score the deliverable against agreed thresholds and ship the scorecard alongside it. Both sides see exactly what passed, what didn't, and why.",
    contrast: [
      { from: "Subjective sign-off", to: "Documented pass / fail" },
      { from: "Scope-creep arguments", to: "Threshold-anchored revisions" },
      { from: "\u201CIt looks off\u201D", to: "\u201CFrame 47 failed identity at 0.78\u201D" },
    ],
  },
  {
    audience: "Studios & high-volume pipelines",
    title: "Automated batch vetting & culling",
    body: "Score every generation in a batch automatically. Reject obvious failures \u2014 wrong codec, severe artifacts, identity drift \u2014 at the gate, before they ever reach a reviewer. Humans see only the assets worth their time.",
    contrast: [
      { from: "1,000 generations", to: "The 50 worth reviewing" },
      { from: "Manual triage", to: "Automated gating" },
      { from: "\u201CSomething looks bad\u201D", to: "Frame-level flags with bounding boxes" },
    ],
  },
];

export function UseCasesSection() {
  return (
    <section className="border-t border-border px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/80">
            Use cases
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-100 md:text-3xl">
            What this does for you
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Two real problems. Both showing up in AI workflows right now.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.audience}
              className="rounded-xl border border-border bg-surface-elevated p-6 transition-colors hover:border-border-hover"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                {uc.audience}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-zinc-100">
                {uc.title}
              </h3>
              <p className="mt-3 text-sm text-zinc-400">{uc.body}</p>

              <ul className="mt-5 space-y-2">
                {uc.contrast.map(({ from, to }) => (
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
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 rounded-lg border border-border bg-surface px-5 py-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/80">
                Bonus
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-100">
                Independent benchmarking, by-product
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            Same metrics, same thresholds, applied across models. The framework
            is model-agnostic by design — making it equally useful as the basis
            for neutral, published comparisons. No marketing claims; just the
            scores.
          </p>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-6"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Link
            href="/use-cases"
            className="inline-flex items-center gap-2 text-cyan-400 transition-colors hover:text-cyan-300"
          >
            See all use cases
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
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-200"
          >
            See how it works
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
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Talk to us about a pilot
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
        </motion.div>
      </div>
    </section>
  );
}
