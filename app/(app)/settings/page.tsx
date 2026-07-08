import { AccountSection } from "@/components/settings/account-section";
import { ProfileSection } from "@/components/settings/profile-section";
import { PomodoroSection } from "@/components/settings/pomodoro-section";
import { BehaviorSection } from "@/components/settings/behavior-section";
import { BlockerSection } from "@/components/settings/blocker-section";
import { DataSection } from "@/components/settings/data-section";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
      <AccountSection />
      <ProfileSection />
      <PomodoroSection />
      <BehaviorSection />
      <BlockerSection />
      <DataSection />
    </div>
  );
}
