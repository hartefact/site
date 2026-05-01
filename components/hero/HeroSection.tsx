"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const show = (values: Record<string, number>) =>
    mounted ? values : undefined;

  return (
    <section
      className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 py-24"
      aria-label="Hero"
    >
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 12 }}
          animate={show({ opacity: 1, y: 0 })}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src="/logo/hartefact_wordmark.png"
            alt="HarteFact"
            width={599}
            height={157}
            className="h-auto w-full max-w-3xl object-contain"
            priority
          />
          <p className="mt-4 max-w-xl text-center font-mono text-sm tracking-wide text-cyan-400/85">
            Artifacts, evaluated.
          </p>
        </motion.div>
        <motion.p
          className="mt-6 text-lg text-zinc-400 sm:text-xl md:text-2xl"
          initial={{ opacity: 0, y: 8 }}
          animate={show({ opacity: 1, y: 0 })}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        >
          Quality Management Tools and Benchmarking for the Digital Visual Arts.
        </motion.p>
        <motion.p
          className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base"
          initial={{ opacity: 0 }}
          animate={show({ opacity: 1 })}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Pass/fail scorecards for AI deliverables. Automated vetting and culling for
          high-volume production pipelines.
        </motion.p>
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 8 }}
          animate={show({ opacity: 1, y: 0 })}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Link
            href="/methodology"
            className="rounded-lg bg-cyan-500/15 px-5 py-2.5 text-sm font-medium text-cyan-400 ring-1 ring-cyan-500/30 transition-colors hover:bg-cyan-500/25 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Read the methodology
          </Link>
          <Link
            href="/gallery"
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-zinc-300 ring-1 ring-border-hover transition-colors hover:bg-surface-elevated hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            See examples
          </Link>
        </motion.div>
        <motion.p
          className="mt-6 text-xs text-zinc-500"
          initial={{ opacity: 0 }}
          animate={show({ opacity: 1 })}
          transition={{ delay: 0.65, duration: 0.4 }}
        >
          Phase 1 build in progress. First public benchmarks scheduled for 2026.
          {" "}
          <Link
            href="/contact"
            className="text-cyan-400/80 underline-offset-4 hover:underline hover:text-cyan-300"
          >
            Pilot inquiries welcome
          </Link>
          .
        </motion.p>
      </div>
    </section>
  );
}
