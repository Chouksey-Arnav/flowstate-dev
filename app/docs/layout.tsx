import type { Metadata } from "next";
import { DocsTopbar } from "@/components/docs/docs-topbar";
import { DocsSidebar, DocsMobileNav } from "@/components/docs/docs-sidebar";

export const metadata: Metadata = {
  title: {
    default: "Documentation | FlowState",
    template: "%s | FlowState Docs",
  },
  description: "Full documentation for FlowState — tasks, focus, habits, stats, rewards, XP, settings, and privacy.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <DocsTopbar />
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr] md:gap-12">
          <DocsSidebar />
          <div className="min-w-0">
            <DocsMobileNav />
            <div className="mt-6 md:mt-0">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
