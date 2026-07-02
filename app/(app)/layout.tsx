import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HydrationGate } from "@/components/layout/hydration-gate";
import { PageTransition } from "@/components/layout/page-transition";
import { PomodoroEngine } from "@/components/layout/pomodoro-engine";
import { PomodoroStatusPill } from "@/components/layout/pomodoro-status-pill";
import { XpToastStack } from "@/components/gamification/xp-toast-stack";
import { LevelUpModal } from "@/components/gamification/level-up-modal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <HydrationGate>
      <PomodoroEngine />
      <PomodoroStatusPill />
      <XpToastStack />
      <LevelUpModal />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden p-4 pb-20 md:p-8 md:pb-8">
          <PageTransition>{children}</PageTransition>
        </main>
        <MobileNav />
      </div>
    </HydrationGate>
  );
}
