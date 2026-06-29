"use client";

import { Volume2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { AmbientSound } from "@/types";

const OPTIONS: { value: AmbientSound; label: string }[] = [
  { value: "none", label: "None" },
  { value: "lofi", label: "Lofi hum" },
  { value: "rain", label: "Rain" },
  { value: "white", label: "White noise" },
  { value: "brown", label: "Brown noise" },
];

interface AmbientSoundControlProps {
  sound: AmbientSound;
  onSoundChange: (sound: AmbientSound) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function AmbientSoundControl({
  sound,
  onSoundChange,
  enabled,
  onEnabledChange,
  volume,
  onVolumeChange,
}: AmbientSoundControlProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3">
      <Volume2 className="h-4 w-4 text-muted-foreground" />
      <Select value={sound} onValueChange={(v) => onSoundChange(v as AmbientSound)}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Slider
        value={[volume * 100]}
        onValueChange={([v]) => onVolumeChange(v / 100)}
        max={100}
        step={1}
        className="w-32"
        disabled={sound === "none"}
      />
      <Switch checked={enabled} onCheckedChange={onEnabledChange} disabled={sound === "none"} />
    </div>
  );
}
