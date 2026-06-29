# FlowState

A dark-themed, no-excuses anti-procrastination productivity app. Tasks, a Pomodoro focus timer, habits, stats, and a dashboard that ties them together — all running entirely in your browser.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS v3** with hand-written shadcn-style UI primitives (Radix UI under the hood)
- **Zustand** with `persist` for state, four independent domain stores (tasks, habits, focus sessions, settings)
- **Recharts** for the weekly bar chart and category donut
- **Framer Motion** for page transitions and list animations
- **Web Audio API** for all timer/completion/ambient sounds — synthesized client-side, no audio files or third-party embeds
- **canvas-confetti** for task-completion celebrations

## Data storage

Everything is stored in your browser's `localStorage` (under `flowstate-tasks`, `flowstate-habits`, `flowstate-focus`, `flowstate-settings`). There is no backend and no account — your data lives on the device you use it on. Use Settings → Export data as JSON to back it up.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

Other useful scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run build       # production build
```

## Features

- **Dashboard** — greeting, day-of-year counter, task streak, editable daily goal, top 3 tasks, an independent mini Pomodoro widget, a rotating motivational quote, habit status dots, a mini weekly chart, and quick-add.
- **Tasks** — full CRUD with subtasks, categories, priorities, due dates, filtering/sorting, manual drag-to-reorder, brain-dump rapid entry, archive view, bulk actions, and confetti + chime + undo toast on completion.
- **Focus** — a drift-free Pomodoro timer (work/break/long-break), an SVG ring display, a session log, a "Watch all" lofi video grid, a distraction-free Full Focus Mode, and ambient sound (lofi/rain/white/brown noise, all synthesized).
- **Habits** — weekly completion grid, streaks (current + best), a Perfect Day badge, drag-to-reorder, and six pre-loaded defaults.
- **Stats** — completion/focus-time/habit-rate/streak stat cards, a category donut, a weekly bar chart, and a CSS-grid monthly heatmap with month navigation.
- **Settings** — profile, Pomodoro durations and timer sound, behavior toggles (confetti, sound, auto-start, first day of week), and data actions (JSON export, clear completed, reset habit streaks, reset everything).

Responsive down to mobile widths: the sidebar collapses below `md` in favor of a bottom tab bar.

## Deploying

The app is Vercel-ready as-is — no required environment variables, no server-side dependencies (all state is client-side `localStorage`). Push this repo to Vercel and it will build and deploy with zero configuration.
