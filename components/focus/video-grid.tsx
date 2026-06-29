"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Grid2x2, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoEmbed } from "./video-embed";

const VIDEOS = [
  { id: "jfKfPfyJRdk", title: "Lofi Girl — beats to relax/study to" },
  { id: "5qap5aO4i9A", title: "Lofi Girl — beats to sleep/chill to" },
  { id: "rUxyKA_-grg", title: "Lofi Girl — synthwave radio" },
];

export function VideoGrid() {
  const [watchAll, setWatchAll] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Ambient video</h3>
        <Button variant="outline" size="sm" onClick={() => setWatchAll((v) => !v)}>
          {watchAll ? <Grid2x2 className="mr-1.5 h-4 w-4" /> : <Tv className="mr-1.5 h-4 w-4" />}
          {watchAll ? "Grid view" : "Watch all"}
        </Button>
      </div>

      {watchAll ? (
        <div className="space-y-2">
          <VideoEmbed videoId={VIDEOS[index].id} title={VIDEOS[index].title} />
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIndex((i) => (i - 1 + VIDEOS.length) % VIDEOS.length)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {index + 1} / {VIDEOS.length}
            </span>
            <Button variant="outline" size="sm" onClick={() => setIndex((i) => (i + 1) % VIDEOS.length)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {VIDEOS.map((v) => (
            <VideoEmbed key={v.id} videoId={v.id} title={v.title} />
          ))}
        </div>
      )}
    </div>
  );
}
