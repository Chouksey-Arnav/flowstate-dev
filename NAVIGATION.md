# NAVIGATION.md - Repository Map & Agent Navigation Guide

This document is optimized for AI Agents (Claude / Jules) and human developers to navigate the **FlowState** codebase efficiently with minimum token usage.

---

## ⚡ Quick Feature-to-File Index

When implementing or modifying a feature, consult this matrix to identify exact files without scanning the filesystem:

| Feature / Domain | Route / Page | Primary UI Components | State Store (`store/`) | Business Logic & Utilities (`lib/`) |
| :--- | :--- | :--- | :--- | :--- |
| **Tasks & Brain Dump** | `app/(app)/tasks/page.tsx` | `components/tasks/*` | `taskStore.ts` | `lib/tasks.ts`, `lib/overdue.ts` |
| **Focus / Pomodoro** | `app/(app)/focus/page.tsx` | `components/focus/*` | `pomodoroStore.ts`, `focusStore.ts` | `lib/audio.ts` (Web Audio synth) |
| **Habits & Streaks** | `app/(app)/habits/page.tsx` | `components/habits/*` | `habitStore.ts`, `streakStore.ts` | `lib/habits.ts`, `lib/streaks.ts`, `lib/habit-icons.ts` |
| **Stats & Analytics** | `app/(app)/stats/page.tsx` | `components/stats/*` | Reads tasks/focus/habits stores | `lib/stats.ts`, `lib/badges.ts` |
| **Gamification & XP** | Topbar / Badges / Modals | `components/gamification/*` | `xpStore.ts`, `xpToastStore.ts` | `lib/xp.ts`, `lib/badges.ts`, `lib/confetti.ts` |
| **Dashboard** | `app/(app)/dashboard/page.tsx` | `components/dashboard/*` | Orchestrates all domain stores | `lib/dailyGoal.ts`, `lib/quotes.ts` |
| **Accountability / Reckoning** | Mounted in `app/(app)/layout.tsx` | `components/reckoning/*`, `dashboard/debt-card.tsx`, `dashboard/why-card.tsx`, `stats/reckoning-wall.tsx`, `tasks/debt-badge.tsx` | `ledgerStore.ts` | `lib/reckoning.ts` (sealing, debt), `lib/guilt.ts` (tone/copy) |
| **Settings & Sync** | `app/(app)/settings/page.tsx` | `components/settings/*` | `settingsStore.ts`, `blockerStore.ts` | `lib/export.ts`, `lib/blockerScript.ts` |
| **Auth & Accounts** | `app/(auth)/login/`, `signup/` | `components/auth/*` | Auth session (`lib/supabase/`) | `lib/auth/actions.ts`, `supabase/functions/*` |
| **Landing Page** | `app/page.tsx` | `components/marketing/*` | N/A | `lib/site.ts`, `lib/desktop-install.ts` |
| **Docs Site** | `app/docs/`, `app/docs/[slug]` | `components/docs/*` | N/A | `lib/docs.ts` |

---

## 📁 Architectural File Tree & Directory Guide

```
├── app/                      # Next.js 14 App Router routes & layouts
│   ├── (app)/                # Authenticated application views
│   │   ├── dashboard/        # Main overview dashboard (`page.tsx`)
│   │   ├── tasks/            # Task management & brain dump (`page.tsx`)
│   │   ├── focus/            # Pomodoro focus mode & ambient sounds (`page.tsx`)
│   │   ├── habits/           # Habit tracking & weekly grid (`page.tsx`)
│   │   ├── stats/            # Analytics charts & heatmap (`page.tsx`)
│   │   └── settings/         # Account, sound, blocker, & data settings (`page.tsx`)
│   ├── (auth)/               # Authentication pages
│   │   ├── login/            # Login page (`page.tsx`)
│   │   └── signup/           # Signup page (`page.tsx`)
│   ├── docs/                 # Public documentation site (`page.tsx`, `[slug]/page.tsx`)
│   ├── layout.tsx            # Root layout (fonts, providers, global styles)
│   ├── page.tsx              # Public landing page
│   ├── globals.css           # Glassmorphism utilities, CSS variables, dark theme
│   ├── robots.ts & sitemap.ts# SEO metadata routes
├── components/               # React components grouped by module
│   ├── ui/                   # Reusable UI primitives (Button, Card, Dialog, Input, etc.)
│   ├── layout/               # Sidebar, MobileNav, HydrationGate, PomodoroEngine
│   ├── dashboard/            # Cards & widgets for dashboard
│   ├── tasks/                # List, Item, Filters, FormDialog, SubtaskList, BrainDump
│   ├── focus/                # PomodoroRing, FullFocusMode, SoundControl, VideoEmbed
│   ├── habits/               # HabitItem, WeeklyGrid, StreakFlame, PerfectDayBadge
│   ├── stats/                # Heatmap, WeeklyBarChart, CategoryDonut, BadgeCase
│   ├── settings/             # Sections for Account, Behavior, Pomodoro, Data, Blocker
│   ├── gamification/         # XPBar, LevelUpModal, StreakMilestoneModal, XPToastStack
│   ├── reckoning/            # ReckoningGate (seals days), ReckoningModal, DayVerdictStrip
│   ├── marketing/            # Landing page sections (Hero, Features, FAQ, SiteNav, Footer)
│   ├── docs/                 # Docs sidebar, topbar, and content renderer
│   └── auth/                 # UsernameField and auth forms
├── store/                    # Zustand state management (Persisted to Supabase KV)
│   ├── taskStore.ts          # CRUD, subtasks, ordering, archive, filters
│   ├── focusStore.ts         # Focus session logging & total focus time
│   ├── pomodoroStore.ts      # Active timer status (work/break, running, remaining time)
│   ├── habitStore.ts         # Habit CRUD & daily completion tracking
│   ├── streakStore.ts        # Task & habit streaks
│   ├── xpStore.ts            # Level, current XP, total XP, level ups
│   ├── xpToastStore.ts       # Non-blocking floating XP gains toasts
│   ├── settingsStore.ts      # User preferences (durations, auto-start, sounds, theme)
│   ├── reflectionStore.ts    # Daily reflection notes & insights
│   ├── blockerStore.ts       # Distraction site blocker rules & script generation
│   └── ledgerStore.ts        # Immutable sealed-day verdicts — the accountability record
├── lib/                      # Pure helper functions, domain logic & API utilities
│   ├── audio.ts              # Web Audio API synthesizer (timer chimes, ambient noise)
│   ├── auth/actions.ts       # Login/signup/change-username edge function callers
│   ├── supabase/             # Supabase client, middleware, server, & kvStorage adapter
│   ├── xp.ts                 # XP calculation rules, level thresholds
│   ├── badges.ts             # Badge definitions & unlock logic
│   ├── tasks.ts & overdue.ts # Task filtering, sorting, overdue helpers
│   ├── habits.ts & streaks.ts# Habit streaks, perfect days, frequency calculations
│   ├── stats.ts              # Aggregations for charts & heatmaps
│   ├── reckoning.ts          # Day sealing, verdicts, task debt, year framing
│   ├── guilt.ts              # Accountability copy engine (gentle/honest/brutal tones)
│   ├── docs.ts               # Markdown docs loader & slug resolver
│   └── site.ts               # Metadata & desktop release download URLs
├── types/                    # TypeScript interfaces & domain types
│   └── index.ts              # Task, Habit, FocusSession, UserSettings, XP State types
├── electron/                 # Desktop wrapper (Electron shell)
│   ├── main.js               # Main process window & offline fallback logic
│   ├── preload.js            # Secure IPC bridge
│   └── offline.html          # Fallback screen when first launch has no network
├── public/                   # Static assets, PWA manifest (`manifest.json`), service worker (`sw.js`)
├── scripts/                  # Helper CLI scripts (Site blocker script generator, IndexNow)
├── supabase/                 # Supabase configuration & Edge Functions
│   └── functions/            # `flowstate-login`, `flowstate-signup`, `flowstate-change-username`
├── CLAUDE.md                 # Key engineering instructions & rules for AI agents
├── BLOCKER_DEBUG_GUIDE.md    # Operating system blocker diagnostic guide
└── README.md                 # General project overview & setup guide
```

---

## 🛠 Architectural Systems & Data Flow

### 1. State Management & Data Persistence (`store/` + `lib/supabase/kvStorage.ts`)
* All Zustand domain stores use custom `persist` middleware configured with `kvStorage`.
* `kvStorage` serializes store state as JSON and syncs it with the Supabase Postgres `flowstate_kv` table keyed by account user ID.
* If user is offline or Supabase environment variables are absent, `kvStorage` gracefully falls back to `localStorage`.
* **Note:** `pomodoroStore` (active live timer count) intentionally remains in local storage to prevent unnecessary network overhead.

### 2. Audio Architecture (`lib/audio.ts`)
* Zero external audio files or third-party embeds (e.g. YouTube audio) are used for ambient audio or timer alarms.
* All audio (timer start/end chimes, ambient lofi, rain, white/brown noise) is dynamically synthesized using the browser's **Web Audio API**.

### 3. Accountability Ledger (`lib/reckoning.ts` + `store/ledgerStore.ts`)
* `ReckoningGate` (mounted in the app layout) seals every fully-passed day into an immutable `DayRecord`, once per session per date.
* Sealing is a **pure** function of the world as it was, so it can be replayed without changing what a past day means. Records are append-only — `sealDays` never overwrites an existing date.
* A missed day is written onto the task itself (`Task.missedDays`). `getTasksDueOn` / `getPerfectDayKeys` read that list, and that is what keeps history immutable: carrying a task forward moves its `dueDate` but can never retroactively turn a failed day into a Perfect Day.
* A day with nothing due is always `empty` and never triggers a confrontation. Precision here is what stops the system becoming noise the user learns to click through.
* All user-facing wording lives in `lib/guilt.ts`, tiered by the `guiltIntensity` setting. Copy targets the choice, never the person, and always ends with an action.

### 4. Auth Model (`lib/auth/actions.ts` & `supabase/functions/`)
* Supabase Auth is mapped to usernames by generating internal `<uuid>@flowstate.internal` emails.
* Account operations (signup, login, username changes) are proxied through Supabase Edge Functions (`flowstate-signup`, `flowstate-login`, `flowstate-change-username`) to keep the service-role key secure.

---

## 💡 Guidelines for Agents Working on Code Modifications

1. **Locate Target Files**: First, locate the target module using the **Quick Feature-to-File Index**.
2. **Types First**: Check `types/index.ts` whenever introducing new properties to tasks, habits, stats, or settings.
3. **UI Components**: UI components reside in `components/ui/` (Radix primitives styled with Tailwind CSS & glassmorphism classes from `app/globals.css`).
4. **Desktop Sync**: When modifying landing page versions or desktop release logic, review instructions in `CLAUDE.md`.
