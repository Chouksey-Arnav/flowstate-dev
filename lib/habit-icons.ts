import {
  Droplets,
  Dumbbell,
  BookOpen,
  Brain,
  Briefcase,
  ListChecks,
  Sun,
  Moon,
  Coffee,
  Smile,
  Music,
  PenTool,
  type LucideIcon,
} from "lucide-react";

export const HABIT_ICON_MAP: Record<string, LucideIcon> = {
  Droplets,
  Dumbbell,
  BookOpen,
  Brain,
  Briefcase,
  ListChecks,
  Sun,
  Moon,
  Coffee,
  Smile,
  Music,
  PenTool,
};

export const HABIT_ICON_NAMES = Object.keys(HABIT_ICON_MAP);

export function getHabitIcon(name: string): LucideIcon {
  return HABIT_ICON_MAP[name] ?? ListChecks;
}
