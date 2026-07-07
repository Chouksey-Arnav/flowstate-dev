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
  const activeTaskCount = useTaskStore((s) => s.tasks.filter((t) => t.status === "active").length);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen flex-col border-r border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-200 md:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className={cn("flex items-center gap-2.5 px-4 py-6", collapsed && "justify-center px-0")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-primary text-sm font-black text-primary-foreground shadow-glow ring-1 ring-white/20">
          F
        </div>
        {!collapsed && <span className="text-base font-bold tracking-tighter text-gradient">FlowState</span>}
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
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300",
                active
                  ? "bg-primary/10 text-primary shadow-[inset_0_0_12px_rgba(153,102,255,0.05)] ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              {active && (
                <>
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                  <div className="absolute inset-0 bg-primary/5 blur-sm" />
                </>
              )}
              <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110", active && "drop-shadow-[0_0_3px_hsl(var(--primary)/0.5)]")} />
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
