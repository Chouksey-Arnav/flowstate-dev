"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListTodo,
  Timer,
  Flame,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/taskStore";
import { XpBar } from "@/components/gamification/xp-bar";
import { calculatePerfectDayStreak } from "@/lib/streaks";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/focus", label: "Focus", icon: Timer },
  { href: "/habits", label: "Habits", icon: Flame },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const tasks = useTaskStore((s) => s.tasks);
  const hasHydrated = useTaskStore((s) => s.hasHydrated);
  const activeTaskCount = tasks.filter((t) => t.status === "active").length;
  const streak = hasHydrated ? calculatePerfectDayStreak(tasks).current : 0;

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen flex-col border-r border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-200 md:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className={cn("flex items-center gap-2.5 px-4 py-5", collapsed && "justify-center px-0")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground shadow-sm shadow-primary/40">
          F
        </div>
        {!collapsed && <span className="text-sm font-semibold tracking-tight text-gradient">FlowState</span>}
      </div>

      <nav className="flex-1 space-y-1 px-2.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && item.href === "/tasks" && activeTaskCount > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-xs",
                    active ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                  )}
                >
                  {activeTaskCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {streak > 0 && (
        <div
          className={cn(
            "flex items-center gap-1.5 border-t border-border/60 px-3 py-2.5 text-flow-yellow",
            collapsed && "justify-center px-0"
          )}
          title={`${streak}-day Perfect Day streak`}
        >
          <Flame className="h-4 w-4 shrink-0" fill="currentColor" />
          <span className="text-sm font-bold tabular-nums">{streak}</span>
          {!collapsed && <span className="text-xs font-medium text-muted-foreground">day streak</span>}
        </div>
      )}

      <div className="border-t border-border/60">
        <XpBar collapsed={collapsed} />
      </div>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center gap-2 border-t border-border/60 px-3 py-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        {!collapsed && "Collapse"}
      </button>
    </aside>
  );
}
