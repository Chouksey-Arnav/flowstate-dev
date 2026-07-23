export interface StreakBadge {
  /** Also the streak-day threshold, as a string — stable identity for persisted `earnedBadgeIds`. */
  id: string;
  threshold: number;
  name: string;
  tagline: string;
  bonusXp: number;
}

/**
 * Permanent trophies for consecutive Perfect Days. Unlocked once, kept
 * forever — even if the streak that earned them later resets to 0.
 */
export const STREAK_BADGES: StreakBadge[] = [
  { id: "3", threshold: 3, name: "Spark", tagline: "Three days straight. The fire's lit.", bonusXp: 50 },
  { id: "7", threshold: 7, name: "Ember", tagline: "A full week, perfect. This is a habit now.", bonusXp: 100 },
  { id: "14", threshold: 14, name: "Kindling", tagline: "Two weeks without missing a day. It's catching.", bonusXp: 200 },
  { id: "30", threshold: 30, name: "Wildfire", tagline: "A full month, perfect. This is who you are now.", bonusXp: 400 },
  { id: "60", threshold: 60, name: "Firestorm", tagline: "60 days straight. Nothing's putting this out.", bonusXp: 750 },
  { id: "100", threshold: 100, name: "Inferno", tagline: "Triple digits. You don't quit.", bonusXp: 1200 },
  { id: "180", threshold: 180, name: "Undying Flame", tagline: "Half a year, every single day, perfect.", bonusXp: 2000 },
  { id: "365", threshold: 365, name: "Eternal Flame", tagline: "365 days. A full year without giving up the streak once.", bonusXp: 5000 },
];

export function getBadgeByThreshold(days: number): StreakBadge | undefined {
  return STREAK_BADGES.find((b) => b.threshold === days);
}

/** The next unearned badge ahead of the current streak, for "N days to X" progress copy. */
export function getNextBadge(earnedBadgeIds: string[]): StreakBadge | null {
  return STREAK_BADGES.find((b) => !earnedBadgeIds.includes(b.id)) ?? null;
}

/** Every badge threshold the given streak length has newly crossed but isn't recorded as earned yet. */
export function getNewlyEarnedBadges(streakLength: number, earnedBadgeIds: string[]): StreakBadge[] {
  return STREAK_BADGES.filter((b) => streakLength >= b.threshold && !earnedBadgeIds.includes(b.id));
}
