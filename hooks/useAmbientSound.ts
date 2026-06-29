"use client";

import { useEffect, useRef } from "react";
import { createAmbientLoop, type AmbientHandle } from "@/lib/audio";
import type { AmbientSound } from "@/types";

export function useAmbientSound(sound: AmbientSound, enabled: boolean, volume: number) {
  const handleRef = useRef<AmbientHandle | null>(null);

  useEffect(() => {
    if (!enabled || sound === "none") return;
    const handle = createAmbientLoop(sound, volume);
    handleRef.current = handle;
    return () => {
      handle?.stop();
      handleRef.current = null;
    };
  }, [sound, enabled]);

  useEffect(() => {
    handleRef.current?.setVolume(volume);
  }, [volume]);
}
