import confetti from "canvas-confetti";

const FLOW_COLORS = ["#22C55E", "#3B82F6", "#EF4444", "#EAB308"];

export function fireTaskCompleteConfetti(): void {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: FLOW_COLORS,
    disableForReducedMotion: true,
  });
}
