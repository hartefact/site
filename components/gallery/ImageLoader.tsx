"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/data/galleryImages";

export interface ImageLoaderProps {
  image: GalleryImage;
  size: "thumbnail" | "full";
  fill?: boolean;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}

/**
 * Progressive image loading: blur placeholder, lazy load, no layout shift.
 * Uses Next/Image for optimization. Shows fallback if image fails to load.
 */
export function ImageLoader({
  image,
  size,
  fill = false,
  className = "",
  priority = false,
  onLoad,
}: ImageLoaderProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const src = size === "thumbnail" ? image.thumbnailSrc : image.fullSrc;
  const alt = image.title ?? `Gallery image ${image.id}`;

  if (error) {
    return (
      <span
        className={`relative flex items-center justify-center bg-zinc-800/80 ${className}`}
        style={fill ? { position: "absolute", inset: 0 } : undefined}
      >
        <span className="text-center text-xs text-zinc-500" aria-hidden>
          Image unavailable
        </span>
      </span>
    );
  }

  const wrapperClass = fill
    ? `absolute inset-0 overflow-hidden ${className}`
    : `relative block overflow-hidden ${className}`;

  return (
    <span className={wrapperClass}>
      {/* Placeholder until image loads */}
      {!loaded && (
        <span
          className="absolute inset-0 animate-pulse bg-zinc-800"
          aria-hidden
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : image.width}
        height={fill ? undefined : image.height}
        fill={fill}
        sizes={
          size === "thumbnail"
            ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            : "100vw"
        }
        className={`object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={() => setError(true)}
        unoptimized
      />
    </span>
  );
}
