"use client";

import { motion } from "framer-motion";

/**
 * Brand title with colorful gradient and subtle 3D/depth.
 * CSS-only: lightweight, no WebGL. Modern, clean, not cartoonish.
 */
export function BrandTitle3D() {
  return (
    <motion.h1
      className="relative text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-label="HarteFact"
    >
      <span
        className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
        style={{
          textShadow:
            "0 0 40px rgba(34, 211, 238, 0.15), 0 2px 4px rgba(0,0,0,0.2)",
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
        }}
      >
        HarteFact
      </span>
    </motion.h1>
  );
}
