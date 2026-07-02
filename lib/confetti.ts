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

export function fireLevelUpConfetti(): void {
  const shared = { colors: FLOW_COLORS, disableForReducedMotion: true };
  confetti({ ...shared, particleCount: 100, spread: 100, angle: 60, origin: { x: 0, y: 0.6 } });
  confetti({ ...shared, particleCount: 100, spread: 100, angle: 120, origin: { x: 1, y: 0.6 } });
}
