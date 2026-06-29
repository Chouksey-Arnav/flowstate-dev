import { Sidebar } from "@/components/layout/sidebar";
import { HydrationGate } from "@/components/layout/hydration-gate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <HydrationGate>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
      </div>
    </HydrationGate>
  );
}
