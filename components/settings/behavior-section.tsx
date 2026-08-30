"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsStore } from "@/store/settingsStore";
import type { FirstDayOfWeek } from "@/types";

export function BehaviorSection() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const confettiEnabled = useSettingsStore((s) => s.confettiEnabled);
  const desktopNotificationsEnabled = useSettingsStore((s) => s.desktopNotificationsEnabled);
  const autoStartNext = useSettingsStore((s) => s.autoStartNext);
  const firstDayOfWeek = useSettingsStore((s) => s.firstDayOfWeek);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Behavior</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="sound-enabled">Sound effects</Label>
          <Switch
            id="sound-enabled"
            checked={soundEnabled}
            onCheckedChange={(v) => updateSettings({ soundEnabled: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="confetti-enabled">Confetti on task complete</Label>
          <Switch
            id="confetti-enabled"
            checked={confettiEnabled}
            onCheckedChange={(v) => updateSettings({ confettiEnabled: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-start-next">Auto-start next Pomodoro phase</Label>
          <Switch
            id="auto-start-next"
            checked={autoStartNext}
            onCheckedChange={(v) => updateSettings({ autoStartNext: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="desktop-notifications">
            Notify when a Pomodoro phase ends
          </Label>
          <Switch
            id="desktop-notifications"
            checked={desktopNotificationsEnabled}
            onCheckedChange={(v) => updateSettings({ desktopNotificationsEnabled: v })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>First day of week</Label>
          <Select
            value={firstDayOfWeek}
            onValueChange={(v) => updateSettings({ firstDayOfWeek: v as FirstDayOfWeek })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sunday">Sunday</SelectItem>
              <SelectItem value="monday">Monday</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
