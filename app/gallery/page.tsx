import Image from "next/image";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { galleryImages } from "@/data/galleryImages";

export const metadata = {
  title: "Examples — HarteFact",
  description:
    "Reference assets representing the kind of AI-generated visual content the HarteFact framework scores. Future versions of this page will display per-asset scorecards.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10 flex items-start gap-4">
        <Image
          src="/logo/funnel_logo.png"
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
        />
        <div>
          <h1 className="text-3xl font-semibold text-zinc-100 md:text-4xl">
            Examples
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Reference assets representing the kind of AI-generated content the
            framework scores. Future versions of this page will display the QA
            scorecard alongside each asset — at which point this page becomes
            &ldquo;Scorecards.&rdquo;
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Click any image for full resolution.
          </p>
        </div>
      </header>
      <GalleryGrid images={galleryImages} />
    </div>
  );
}
