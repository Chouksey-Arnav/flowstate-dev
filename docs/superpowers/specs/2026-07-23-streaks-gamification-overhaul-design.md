# Streaks & gamification overhaul — design

Date: 2026-07-23
Branch: `claude/streaks-gamification-overhaul-2e33p2`

## Problem

FlowState already has partial streak/XP infrastructure (a numeric
"daily task goal," a streak card, a flat 50 XP bonus, per-habit streak
flames, a level-up modal), but it doesn't carry the weight it needs to:
no milestone celebrations, no badges, streak visibility is limited to a
couple of dashboard cards, and the "complete everything today" idea
isn't actually how the streak works today (it's "hit an arbitrary
count," which anyone can lowball by setting the goal to 1). The Dan
Martell motivation videos are small and unreliable to play. The goal is
a Duolingo-grade, loss-averse streak system that's woven through the
whole app, plus a real fix for the videos.

## 1. Tasks default to "due today"

- `TaskFormDialog`: the due-date field pre-fills to today's local date
  key for **new** tasks (not when editing an existing task). Fully
  editable/clearable as today — push it out, leave it blank as
  someday/backlog, or attach a recurring schedule instead.
- `taskStore.addTask`: no change needed beyond the form defaulting the
  value it passes in — the store already accepts whatever `dueDate` is
  given.

## 2. Streak redefinition: Perfect Day

The current "hit a numeric goal" streak is replaced by a **Perfect
Day** streak: a calendar day counts if and only if every task whose
`dueDate` falls on that day (plus any recurring task active that day
via its `schedule`) is checked off. Archived tasks and tasks with no
due date don't count against you. A day with zero tasks due does not
count as a Perfect Day (no free streak).

This is computed per-day from each task's actual historical `dueDate`
— completing something late doesn't retroactively fix a day already
missed, and un-completing something today doesn't rewrite yesterday.

New helpers in `lib/streaks.ts`:
- `getTasksDueOn(tasks, dateKey): Task[]` — tasks due exactly that day,
  or scheduled tasks active that day, excluding archived.
- `getPerfectDayKeys(tasks): Set<string>` — every date key that
  qualifies as a Perfect Day.
- `calculatePerfectDayStreak(tasks, today?)` — thin wrapper around the
  existing `calculateStreakFromDateSet(getPerfectDayKeys(tasks), today)`,
  same `{ current, best }` shape as today.

`calculateGoalStreak`, `calculateTaskStreak`, and the `dailyTaskGoal`
setting are removed entirely (dead after the replacement — no reason
to keep two parallel streak concepts around). Removed from: `types.ts`
(`Settings.dailyTaskGoal`), `settingsStore.ts` defaults/snapshot,
`taskStore.ts` bonus logic, and every page/component that reads
`dailyTaskGoal` (`dashboard`, `tasks`, `stats` pages, `GoalProgressCard`,
`StreakWarningBanner`, `MomentumBar` inputs). `dailyGoal` (the free-text
personal mission string in Settings) is unrelated and untouched.

**No streak freeze.** Miss a day with anything due on it and the streak
returns to 0 the next day. No purchase, no grace period.

## 3. XP economy changes

`lib/xp.ts`:
- `DAILY_GOAL_BONUS_XP` (50, flat) is replaced by
  `PERFECT_DAY_BASE_XP = 15` plus a streak-length kicker: `min(streak
  length after today counts, 25)` extra XP, so the daily bonus grows
  from 16 XP on day 1 up to a 40 XP cap around day 25+ — the streak
  becoming more valuable the longer it runs is the "stakes" lever.
- New one-time **milestone bonuses**, paid the moment a badge unlocks
  (see below), on top of the daily bonus.
- `XpSource` grows two variants replacing `"dailyGoal"`: `"perfectDay"`
  (the daily bonus) and `"milestone"` (badge unlock bonus).

`taskStore.completeTask` / `uncompleteTask` / `toggleTodayCompletion`
are rewritten to award/revoke the Perfect Day bonus by comparing
"were all of today's due tasks complete before this toggle vs. after,"
using `getTasksDueOn`, mirroring the before/after comparison pattern
already used for the old goal-count bonus.

## 4. Badges — 8 streak milestones

A new persisted store, `store/streakStore.ts`:
- `earnedBadgeIds: string[]` — permanent once unlocked, never revoked
  even if the streak later resets to 0.
- `longestStreakEver: number` and `totalPerfectDays: number` —
  monotonically-increasing safety nets (`max(stored, live-computed)` on
  every update), so trophies survive even if old completed tasks are
  later cleared out of the task list.

Badge ladder (id = streak-day threshold):

| Days | Name | Icon theme | Bonus XP |
|---|---|---|---|
| 3 | Spark | small flame | 50 |
| 7 | Ember | — | 100 |
| 14 | Kindling | — | 200 |
| 30 | Wildfire | — | 400 |
| 60 | Firestorm | — | 750 |
| 100 | Inferno | — | 1,200 |
| 180 | Undying Flame | — | 2,000 |
| 365 | Eternal Flame | — | 5,000 |

A new `components/gamification/streak-milestone-modal.tsx`, mounted at
app root next to the existing `LevelUpModal`: watches the computed
Perfect Day streak, and when it crosses a threshold not yet in
`earnedBadgeIds`, records the badge, awards the bonus XP, and shows a
full-screen celebration (same visual language/animation family as
`LevelUpModal`: spring-in card, confetti via `lib/confetti.ts`, backdrop
blur). If a level-up and a badge unlock land on the same tick, they
queue instead of stacking — badge modal first, then level-up.

## 5. Streak visibility, throughout

- **Sidebar** (`components/layout/sidebar.tsx`): a persistent streak
  flame + current count next to the XP bar, visible on every page, not
  just the dashboard.
- **Dashboard**: existing `StreakCard` stays as the hero streak
  display; `StreakWarningBanner` and the replacement for
  `GoalProgressCard` (renamed conceptually to "Today's tasks," no more
  editable numeric target — just due-today completion) both read from
  `getTasksDueOn`/Perfect Day status instead of the old goal. New
  compact "next badge" progress strip: e.g. "23 days to Wildfire."
- **Tasks page**: `MomentumBar` takes due-today counts instead of the
  broader "today's visible list" counts, so the language matches the
  streak exactly.
- **Stats page**: new Badge Case grid (locked/unlocked, unlock dates,
  progress ring to the next one) plus the existing streak stat card
  updated to Perfect Day numbers. `Heatmap` gets a gold ring on cells
  that were full Perfect Days (vs. the existing green intensity for
  raw activity count), so the calendar visually distinguishes "did
  something" from "cleared the day."
- **Habits page**: unchanged — habits keep their own independent
  per-habit streak system (`StreakFlame`), not folded into Perfect Day,
  since the user's ask was specifically about tasks.

## 6. Dan Martell videos

Two real, separate problems, both fixed:
- **Missing fullscreen permission**: `VideoEmbed`'s iframe `allow`
  attribute never included `fullscreen`. Adding it makes the fullscreen
  button in the YouTube player chrome actually work.
- **Reliability**: switch from conditionally *mounting* a brand-new
  iframe on click (which can lose the click's "user gesture" context
  for autoplay in stricter embedded contexts, including Electron) to a
  persistent iframe with its `src` set imperatively inside the click
  handler on an element that already exists in the DOM — the standard
  fix for "embedded video doesn't start after clicking a thumbnail."
- **Sizing**: all three videos stay in an equal 3-up layout (per your
  last message — no hero/picker), but the card and each player are
  scaled up meaningfully (larger min-height, bigger tap target) so
  they read as a real feature, not an afterthought. All three
  independently clickable and playable.

## 7. Release housekeeping

Per `CLAUDE.md`: bump `package.json` version and `public/sw.js`
`CACHE_VERSION` in the same commit, since this changes cached
app-shell behavior (new components, changed pages). No Electron shell
changes are needed — `electron/main.js` just loads the deployed web
app, so already-installed `.dmg`/`.exe`/`.AppImage` builds pick up
everything here on next launch with no reinstall.

## Explicitly out of scope

- No streak freeze/repair of any kind (confirmed).
- No push notifications — this is a local-first PWA with no
  notification backend; the existing in-app warning banner is the only
  "at risk" signal.
- No social/leaderboard features (single-player app).
- Habits keep their existing separate streak system, unchanged.
- Archived tasks never count toward a day's Perfect Day requirement,
  including the day they're archived — same convention `getTodaysTasks`
  already uses. (Documented simplification: this means archiving a
  task due today does remove it from that day's requirement. Treated
  as an accepted edge case, not a loophole worth extra tracking machinery
  for, given this is a self-motivation tool rather than an adversarial
  multi-user system.)
