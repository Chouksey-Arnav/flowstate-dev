"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

export function VideoEmbed({ videoId, title, className }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function handlePlay() {
    setPlaying(true);
    // The iframe already exists in the DOM (just hidden behind the
    // thumbnail) — setting its src here, synchronously inside the click
    // handler, ties the navigation to this exact user gesture so autoplay
    // reliably starts. Mounting a brand-new iframe on click instead (the
    // previous approach) can lose that gesture association in stricter
    // embedded contexts, including the Electron desktop shell.
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;
    }
  }

  return (
    <div className={className}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-secondary shadow-sm transition-shadow hover:shadow-md">
        <iframe
          ref={iframeRef}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className={cn("h-full w-full", !playing && "hidden")}
        />
        {!playing && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play ${title}`}
            className="group absolute inset-0 h-full w-full"
          >
            <Image
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/35 transition-colors group-hover:bg-black/45">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform group-hover:scale-110">
                <Play className="ml-0.5 h-6 w-6 fill-current" />
              </span>
            </span>
          </button>
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">{title}</p>
    </div>
  );
}
