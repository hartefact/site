import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      className="border-t border-border bg-surface-elevated py-12"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/funnel_logo.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <p className="text-sm text-zinc-500">
              Quality Management Tools and Benchmarking for the Digital Visual Arts
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300 focus-visible:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Home
            </Link>
            <Link
              href="/methodology"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300 focus-visible:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Methodology
            </Link>
            <Link
              href="/use-cases"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300 focus-visible:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Use cases
            </Link>
            <Link
              href="/gallery"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300 focus-visible:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Examples
            </Link>
            <Link
              href="/contact"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300 focus-visible:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Contact
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-zinc-600">
          HarteFact · QA Framework v2.1 · Phase 1 build in progress
        </p>
      </div>
    </footer>
  );
}
