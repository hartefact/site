"use client";

import { motion } from "framer-motion";
import type { GalleryImage } from "@/data/galleryImages";
import { ImageLoader } from "./ImageLoader";

export interface GalleryItemProps {
  image: GalleryImage;
  index: number;
  onSelect: (image: GalleryImage) => void;
}

/**
 * Single gallery card: hover scale/light, optional title overlay.
 */
export function GalleryItem({ image, index, onSelect }: GalleryItemProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-surface-elevated ring-1 ring-border transition-shadow hover:ring-border-hover focus-within:ring-2 focus-within:ring-cyan-500/50 focus-within:ring-offset-2 focus-within:ring-offset-surface"
      onClick={() => onSelect(image)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(image);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={image.title ?? `Open image ${image.id}`}
    >
      <div className="absolute inset-0">
          <ImageLoader
          image={image}
          size="thumbnail"
          fill
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      {/* Subtle overlay on hover */}
      <span
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      {image.title && (
        <span className="absolute bottom-0 left-0 right-0 p-3 text-left text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {image.title}
        </span>
      )}
    </motion.article>
  );
}
