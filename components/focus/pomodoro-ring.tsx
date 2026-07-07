"use client";

import { motion } from "framer-motion";

interface PomodoroRingProps {
  progress: number; // 1 = full, 0 = empty
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}

export function PomodoroRing({ progress, size = 240, strokeWidth = 12, color = "#3B82F6", children }: PomodoroRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)));
  const isActive = progress > 0 && progress < 1;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{
            strokeDashoffset: offset,
            strokeWidth: isActive ? strokeWidth + 2 : strokeWidth,
            filter: isActive ? `drop-shadow(0 0 8px ${color}80)` : "none",
          }}
          transition={{
            strokeDashoffset: { duration: 0.5, ease: "linear" },
            strokeWidth: { duration: 2, repeat: Infinity, repeatType: "reverse" },
          }}
        />
        {isActive && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="opacity-30 blur-md"
            animate={{
              strokeDashoffset: offset,
              scale: [1, 1.05, 1],
            }}
            transition={{
              strokeDashoffset: { duration: 0.5, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{ transformOrigin: "center" }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
