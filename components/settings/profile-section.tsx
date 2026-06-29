"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/store/settingsStore";

export function ProfileSection() {
  const name = useSettingsStore((s) => s.name);
  const dailyGoal = useSettingsStore((s) => s.dailyGoal);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="settings-name">Your name</Label>
          <Input
            id="settings-name"
            value={name}
            onChange={(e) => updateSettings({ name: e.target.value })}
            placeholder="What should we call you?"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="settings-goal">Daily goal</Label>
          <Input
            id="settings-goal"
            value={dailyGoal}
            onChange={(e) => updateSettings({ dailyGoal: e.target.value })}
            placeholder="e.g. Ship the FlowState MVP"
          />
        </div>
      </CardContent>
    </Card>
  );
}
