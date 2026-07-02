"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface VideoEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

export function VideoEmbed({ videoId, title, className }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={className}>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-secondary">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title}`}
            className="group relative h-full w-full"
          >
            <Image
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform group-hover:scale-110">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </span>
            </span>
          </button>
        )}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{title}</p>
    </div>
  );
}
