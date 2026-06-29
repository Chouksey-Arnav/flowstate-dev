export function SplashSkeleton() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-primary/40" />
        <p className="text-sm text-muted-foreground">Loading FlowState…</p>
      </div>
    </div>
  );
}
