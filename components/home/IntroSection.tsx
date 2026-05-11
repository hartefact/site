"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const dimensions = [
  { id: 1, name: "Technical Delivery", note: "Specs, codecs, VMAF" },
  { id: 2, name: "Spatial & Texture", note: "Artifacts, banding, noise" },
  { id: 3, name: "Temporal & Motion", note: "Flicker, optical flow, stability" },
  { id: 4, name: "Audio Quality", note: "LUFS, clipping, sync offset" },
  { id: 5, name: "Lip Sync Precision", note: "MAR, DTW, phoneme timing" },
  { id: 6, name: "Character & Identity", note: "Identity drift, hands, anatomy" },
  { id: 7, name: "Lighting & Scene", note: "Shadows, color temperature" },
  { id: 8, name: "Brand & Client Compliance", note: "Palette, talent, LUTs" },
  { id: 9, name: "Prompt & Action Adherence", note: "VLM-evaluated framing" },
];

export function IntroSection() {
  return (
    <section className="border-t border-border bg-surface-elevated/50 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/80">
            The framework
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-100 md:text-3xl">
            Nine dimensions. Three gates. Automated scorecards.
          </h2>
        </motion.div>
        <motion.p
          className="mt-4 max-w-3xl text-zinc-400"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          Nine things that can go wrong with an AI deliverable. Three gates that catch them in order of cost. Each dimension is a distinct axis of output quality — a gated pipeline rules out fast failures cheaply, then runs deeper analysis only on what survives.
        </motion.p>
        <motion.p
          className="mt-3 max-w-3xl text-sm text-zinc-500"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          Local-first. No cloud dependencies. Designed to run on Apple Silicon
          using open-source components.
        </motion.p>

        <motion.div
          className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {dimensions.map(({ id, name, note }) => (
            <div
              key={id}
              className="rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-border-hover"
            >
              <p className="font-mono text-xs text-cyan-400/70">
                D{id.toString().padStart(2, "0")}
              </p>
              <p className="mt-0.5 text-sm font-medium text-zinc-100">
                {name}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{note}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap gap-6"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 text-cyan-400 transition-colors hover:text-cyan-300"
          >
            Read the methodology
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/use-cases"
            className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Explore use cases
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
