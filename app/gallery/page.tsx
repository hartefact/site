import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Examples — HarteFact",
  description:
    "See HarteFact output: Gate 1 spec checks in the Streamlit UI, batch HTML reports from the CLI, and a workflow walkthrough.",
};

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

export default function GalleryPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/80">
          Examples
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-zinc-100 md:text-5xl">
          What HarteFact output looks like
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-400">
          A single-file check, a batch report, and a walkthrough of the full workflow.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-zinc-100">Single-file spec check</h2>
        <p className="mt-4 max-w-3xl text-sm text-zinc-400">
          Upload a file, select a delivery preset, and Gate 1 returns a pass/fail scorecard in seconds.
          Failed checks show exactly which spec was missed and by how much.
        </p>
        <Image
          src="/examples/ui-scorecard.png"
          alt="HarteFact Spec Check showing a failed Gate 1 scorecard"
          width={1400}
          height={788}
          className="mt-6 block h-auto w-full rounded-lg border border-zinc-700"
        />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-zinc-100">Batch QA report</h2>
        <p className="mt-4 max-w-3xl text-sm text-zinc-400">
          Run a folder of assets through the CLI and HarteFact produces a self-contained HTML report — no external
          dependencies, opens in any browser. Filter by pass or fail, expand individual failure details, and hover any
          Run ID for the full audit reference.
        </p>
        <Link
          href="/examples/sample-report.html"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-cyan-400 transition-colors hover:text-cyan-300"
        >
          View sample report
          <ArrowIcon />
        </Link>
        <p className="mt-2 max-w-3xl text-xs text-zinc-500">
          Real output from a batch run of 36 assets against the Standard Web Image preset.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-zinc-100">Full workflow walkthrough</h2>
        <p className="mt-4 max-w-3xl text-sm text-zinc-400">
          A three-minute walkthrough covering preset selection, single-file upload and scorecard, and a full batch run
          with the resulting HTML report, CSV, and JSON manifest.
        </p>
        {/* TODO: replace with YouTube iframe or next/video once walkthrough is recorded */}
        <div
          className="mt-6 flex aspect-video w-full items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900"
          role="img"
          aria-label="Video placeholder"
        >
          <p className="text-sm text-zinc-500">Video coming soon</p>
        </div>
      </section>
    </article>
  );
}
