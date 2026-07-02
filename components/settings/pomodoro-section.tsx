"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsStore } from "@/store/settingsStore";
import type { TimerSoundType } from "@/types";

const SOUND_OPTIONS: { value: TimerSoundType; label: string }[] = [
  { value: "bell", label: "Bell" },
  { value: "digital", label: "Digital beep" },
  { value: "silent", label: "Silent" },
];

export function PomodoroSection() {
  const pomodoroWork = useSettingsStore((s) => s.pomodoroWork);
  const pomodoroBreak = useSettingsStore((s) => s.pomodoroBreak);
  const pomodoroLongBreak = useSettingsStore((s) => s.pomodoroLongBreak);
  const timerSoundType = useSettingsStore((s) => s.timerSoundType);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pomodoro timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="pomodoro-work" className="whitespace-nowrap">
              Work
            </Label>
            <Input
              id="pomodoro-work"
              type="number"
              min={1}
              max={180}
              value={pomodoroWork}
              onChange={(e) => updateSettings({ pomodoroWork: Math.max(1, Number(e.target.value) || 1) })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pomodoro-break" className="whitespace-nowrap">
              Break
            </Label>
            <Input
              id="pomodoro-break"
              type="number"
              min={1}
              max={60}
              value={pomodoroBreak}
              onChange={(e) => updateSettings({ pomodoroBreak: Math.max(1, Number(e.target.value) || 1) })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pomodoro-long-break" className="whitespace-nowrap">
              Long break
            </Label>
            <Input
              id="pomodoro-long-break"
              type="number"
              min={1}
              max={60}
              value={pomodoroLongBreak}
              onChange={(e) => updateSettings({ pomodoroLongBreak: Math.max(1, Number(e.target.value) || 1) })}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">All durations are in minutes.</p>
        <div className="space-y-1.5">
          <Label>Timer sound</Label>
          <Select
            value={timerSoundType}
            onValueChange={(v) => updateSettings({ timerSoundType: v as TimerSoundType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOUND_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
