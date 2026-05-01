"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import type { GalleryImage } from "@/data/galleryImages";
import { GalleryItem } from "./GalleryItem";
import { LightboxViewer } from "./LightboxViewer";

export interface GalleryGridProps {
  images: GalleryImage[];
}

/**
 * Responsive masonry-like grid with hover interactions.
 * Handles 100+ images via lazy loading; virtualization can be added later.
 */
export function GalleryGrid({ images }: GalleryGridProps) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  const openLightbox = useCallback((image: GalleryImage) => {
    setSelected(image);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <>
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="list"
        aria-label="AI image gallery"
      >
        {images.map((image, index) => (
          <div key={image.id} role="listitem">
            <GalleryItem
              image={image}
              index={index}
              onSelect={openLightbox}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <LightboxViewer
            key={selected.id}
            images={images}
            initialId={selected.id}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </>
  );
}
