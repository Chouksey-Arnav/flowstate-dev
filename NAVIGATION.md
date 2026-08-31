# NAVIGATION.md - Repository Map & Agent Navigation Guide

This document is token-optimized for AI Agents (Claude / Jules) and human developers to navigate the entire **FlowState** codebase instantly without unnecessary file browsing.

---

## ⚡ Feature-to-File Index & Quick Action Matrix

When implementing or modifying a feature, consult this lookup matrix to jump directly to the target files:

| Feature / Domain | Route / Page | Primary UI Components | State Stores (`store/`) | Business Logic & Helpers (`lib/` & `hooks/`) |
| :--- | :--- | :--- | :--- | :--- |
| **Tasks & Brain Dump** | `app/(app)/tasks/page.tsx` | `components/tasks/*` | `taskStore.ts`, `streakStore.ts` | `lib/tasks.ts`, `lib/overdue.ts`, `lib/id.ts` |
| **Focus & Pomodoro** | `app/(app)/focus/page.tsx` | `components/focus/*` | `pomodoroStore.ts`, `focusStore.ts` | `lib/audio.ts`, `hooks/usePomodoro.ts`, `hooks/useAmbientSound.ts` |
| **Habits & Streaks** | `app/(app)/habits/page.tsx` | `components/habits/*` | `habitStore.ts`, `streakStore.ts` | `lib/habits.ts`, `lib/streaks.ts`, `lib/habit-icons.ts` |
| **Stats & Analytics** | `app/(app)/stats/page.tsx` | `components/stats/*` | Reads `taskStore`, `focusStore`, `habitStore` | `lib/stats.ts`, `lib/badges.ts`, `lib/dates.ts` |
| **Gamification & XP** | Topbar / Modals / Cards | `components/gamification/*` | `xpStore.ts`, `xpToastStore.ts` | `lib/xp.ts`, `lib/badges.ts`, `lib/confetti.ts` |
| **Dashboard** | `app/(app)/dashboard/page.tsx` | `components/dashboard/*` | Orchestrates all domain stores | `lib/dailyGoal.ts`, `lib/quotes.ts`, `lib/reflection.ts` |
| **Settings & Sync** | `app/(app)/settings/page.tsx` | `components/settings/*` | `settingsStore.ts`, `blockerStore.ts` | `lib/export.ts`, `lib/blockerScript.ts` |
| **Auth & Accounts** | `app/(auth)/login/`, `signup/` | `components/auth/*` | Session in `lib/supabase/` | `lib/auth/actions.ts`, `supabase/functions/*` |
| **Landing Page** | `app/page.tsx` | `components/marketing/*` | N/A | `lib/site.ts`, `lib/desktop-install.ts` |
| **Documentation** | `app/docs/`, `app/docs/[slug]` | `components/docs/*` | N/A | `lib/docs.ts` |
| **Desktop Shell** | Native App (`electron/`) | N/A | Local storage / IPC Bridge | `electron/main.js`, `electron/preload.js` |
| **Site Blocker Script** | CLI Script | `components/settings/blocker-section.tsx` | `blockerStore.ts` | `lib/blockerScript.ts`, `scripts/blocker/flowstate-block.sh` |

---

## 📁 Full Directory & Component Breakdown

### 1. App Router Routes (`app/`)
- `app/layout.tsx`: Root HTML layout with font imports, tooltips, hydration gate, and Pomodoro engine background listener.
- `app/globals.css`: Tailwind CSS directives, HSL color tokens, and custom utility classes (`glass-panel`, `glass-morphism`, custom scrollbars).
- `app/page.tsx`: Public marketing landing page.
- `app/(app)/layout.tsx`: Main application shell with collapsible sidebar and mobile navigation bar.
- `app/(app)/dashboard/page.tsx`: Core overview dashboard.
- `app/(app)/tasks/page.tsx`: Task management view with tab filters, sorting, and brain-dump mode.
- `app/(app)/focus/page.tsx`: Pomodoro focus interface, ambient sound mixer, YouTube lofi section, and full focus overlay.
- `app/(app)/habits/page.tsx`: Habit tracking page with weekly check-in grid and habit creation modal.
- `app/(app)/stats/page.tsx`: Productivity analytics, category distribution donut chart, weekly bar chart, and monthly activity heatmap.
- `app/(app)/settings/page.tsx`: Tabbed settings for Account, Profile, Behavior, Pomodoro durations, Data export/import, and Site Blocker.
- `app/(auth)/login/page.tsx` & `signup/page.tsx`: Authentication pages supporting username-based Supabase Auth.
- `app/docs/page.tsx` & `app/docs/[slug]/page.tsx`: Interactive documentation hub and individual doc renderer.
- `app/robots.ts` & `app/sitemap.ts`: Dynamic SEO crawlers and sitemap generation.

### 2. Component Organization (`components/`)
- **`components/ui/`**: Radix UI primitives styled with Tailwind CSS (`button.tsx`, `card.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `input.tsx`, `label.tsx`, `password-input.tsx`, `popover.tsx`, `select.tsx`, `slider.tsx`, `switch.tsx`, `textarea.tsx`, `tooltip.tsx`, `badge.tsx`, `empty-state.tsx`).
- **`components/layout/`**: Application layout shell components (`sidebar.tsx`, `mobile-nav.tsx`, `hydration-gate.tsx`, `page-transition.tsx`, `pomodoro-engine.tsx`, `pomodoro-status-pill.tsx`, `splash-skeleton.tsx`).
- **`components/dashboard/`**: Dashboard widgets (`greeting.tsx`, `date-counter.tsx`, `level-hero-card.tsx`, `daily-goal-editable.tsx`, `today-progress-card.tsx`, `goal-progress-card.tsx`, `top-tasks-card.tsx`, `avoided-tasks-card.tsx`, `pomodoro-mini-widget.tsx`, `habit-status-row.tsx`, `streak-card.tsx`, `streak-warning-banner.tsx`, `commitment-card.tsx`, `reflection-insight-card.tsx`, `next-badge-strip.tsx`, `weekly-chart-mini.tsx`, `motivational-quote.tsx`, `daily-reminder-card.tsx`, `quick-add-button.tsx`, `section-heading.tsx`).
- **`components/tasks/`**: Task manager UI (`list.tsx`, `item.tsx`, `filters.tsx`, `sort-control.tsx`, `form-dialog.tsx`, `subtask-list.tsx`, `brain-dump-input.tsx`, `brain-dump-review-dialog.tsx`, `archive-view.tsx`, `bulk-actions-bar.tsx`, `momentum-bar.tsx`, `focus-pick-card.tsx`, `skip-reason-dialog.tsx`, `no-tasks-nudge.tsx`, `undo-toast.tsx`, `category-badge.tsx`, `priority-badge.tsx`, `difficulty-badge.tsx`, `overdue-badge.tsx`, `avoided-badge.tsx`, `pill-select.tsx`).
- **`components/focus/`**: Focus timer interface (`pomodoro-ring.tsx`, `pomodoro-widget.tsx`, `full-focus-mode.tsx`, `ambient-sound-control.tsx`, `motivation-videos.tsx`, `session-task-picker.tsx`, `intention-dialog.tsx`, `video-embed.tsx`).
- **`components/habits/`**: Habit tracker UI (`habit-list.tsx`, `habit-item.tsx`, `weekly-grid.tsx`, `habit-form-dialog.tsx`, `streak-flame.tsx`, `perfect-day-badge.tsx`).
- **`components/stats/`**: Analytics visualization components (`stat-card.tsx`, `weekly-bar-chart.tsx`, `category-donut.tsx`, `heatmap.tsx`, `badge-case.tsx`).
- **`components/settings/`**: Settings sub-sections (`account-section.tsx`, `profile-section.tsx`, `behavior-section.tsx`, `pomodoro-section.tsx`, `data-section.tsx`, `blocker-section.tsx`, `confirm-dialog.tsx`).
- **`components/gamification/`**: Reward and level UI (`xp-bar.tsx`, `level-up-modal.tsx`, `streak-milestone-modal.tsx`, `xp-toast-stack.tsx`).
- **`components/marketing/`**: Landing page sections (`hero-section.tsx`, `app-preview.tsx`, `features-section.tsx`, `feature-row.tsx`, `gamification-section.tsx`, `manifesto-section.tsx`, `quote-marquee.tsx`, `tech-stack-section.tsx`, `docs-section.tsx`, `open-source-section.tsx`, `privacy-section.tsx`, `faq-section.tsx`, `final-cta-section.tsx`, `site-nav.tsx`, `site-footer.tsx`, `first-visit-tip.tsx`, `desktop-download-button.tsx`, `github-star-button.tsx`, `logo-mark.tsx`).
- **`components/docs/`**: Documentation layout and Markdown parser (`docs-topbar.tsx`, `docs-sidebar.tsx`, `doc-content.tsx`).
- **`components/auth/`**: Authentication helper (`username-field.tsx`).
- **`components/pwa-register.tsx`**: PWA service worker registration component.

### 3. State Management (`store/`)
- `store/taskStore.ts`: Task state (CRUD operations, subtask toggles, drag reordering, filters, task archiving).
- `store/pomodoroStore.ts`: Live running timer tick state (phase, remaining seconds, play/pause, auto-start, phase transitions). Kept strictly in `localStorage`.
- `store/focusStore.ts`: Logged completed focus sessions and cumulative focus time statistics.
- `store/habitStore.ts`: Habit definitions and daily check-in histories.
- `store/streakStore.ts`: Current and best streak calculations for tasks and habits.
- `store/xpStore.ts`: Gamification experience points (XP), current level calculation, and level-up thresholds.
- `store/xpToastStore.ts`: Queue for non-blocking floating XP earn toasts.
- `store/settingsStore.ts`: User preferences (Pomodoro timer durations, auto-start options, sound toggles, theme settings).
- `store/reflectionStore.ts`: End-of-day reflections and anti-procrastination skip-reason logs.
- `store/blockerStore.ts`: Distraction domain list and schedule rules for the OS blocker script generator.

### 4. Utilities, Core Business Logic & Hooks (`lib/` & `hooks/`)
- `lib/audio.ts`: Synthesizes timer chimes, completion sounds, and ambient noise (lofi, rain, brown/white noise) using browser Web Audio API.
- `lib/xp.ts`: XP rules for task difficulty, priorities, habit check-ins, and level-up milestones.
- `lib/badges.ts`: Badge definitions and achievement unlock conditions.
- `lib/habits.ts` & `lib/streaks.ts`: Habit completion math, streak counting, and perfect day checks.
- `lib/tasks.ts` & `lib/overdue.ts`: Task filtering, sorting, schedule calculation, and overdue detection helpers.
- `lib/stats.ts`: Data aggregations for charts, donuts, and heatmap visualizations.
- `lib/quotes.ts`: Rotating motivational quotes and task completion micro-copy.
- `lib/dailyGoal.ts`: Target task math and urgency status calculation.
- `lib/reflection.ts`: Processing skip reasons and procrastination insights.
- `lib/blockerScript.ts`: Generates shell scripts (`flowstate-block.sh`) and macOS `launchd` plist configs.
- `lib/export.ts`: JSON export/import serializer for full backup/restore.
- `lib/docs.ts`: Documentation content repository and slug lookup logic.
- `lib/site.ts`: Global application URLs, GitHub repository links, and release metadata.
- `lib/desktop-install.ts`: Platform-specific installation commands for desktop builds.
- `lib/dates.ts`: Date key formatting (`YYYY-MM-DD`), day-of-year calculations, and date math.
- `lib/id.ts` & `lib/utils.ts`: Unique ID generator (`crypto.randomUUID`) and Tailwind class merger (`cn`).
- `lib/auth/actions.ts`: Client-side caller functions for Supabase edge functions.
- `lib/supabase/`: Client, server, middleware, and `kvStorage.ts` persistent state adapter.
- `hooks/usePomodoro.ts`: Hook interfacing with `pomodoroStore` for timer controls.
- `hooks/useAmbientSound.ts`: Hook managing Web Audio ambient sound playback.
- `hooks/useNowTick.ts`: Minute-interval date tick generator.
- `hooks/useBodyScrollLock.ts`: Utility hook locking background page scroll during modal display.

### 5. Backend, Shell & Assets (`supabase/`, `electron/`, `scripts/`, `public/`)
- `supabase/functions/`: Deno Edge Functions for secure auth operations (`flowstate-signup`, `flowstate-login`, `flowstate-change-username`).
- `supabase/config.toml`: Supabase local project configuration.
- `electron/`: Desktop application entry (`main.js`), secure IPC bridge (`preload.js`), fallback screen (`offline.html`), and build icons.
- `scripts/blocker/`: Standalone OS site blocker script (`flowstate-block.sh`) and instructions (`README.md`).
- `scripts/indexnow-ping.mjs`: Search engine indexing ping script.
- `public/`: Manifest (`manifest.json`), PWA service worker (`sw.js`), static icons, and fallback pages.

---

## 🔒 Architectural Rules & Engineering Principles

1. **Supabase KV Persistence**: All Zustand stores (except live `pomodoroStore`) synchronize to Supabase Postgres `flowstate_kv` table via `lib/supabase/kvStorage.ts`. When unauthenticated or offline, they fallback seamlessly to `localStorage`.
2. **Audio Synthesis**: Never introduce external audio assets or audio embedding libraries. Use `lib/audio.ts` Web Audio API generators.
3. **No External Video Audio Embeds**: YouTube embeds are restricted to motivation clips (`components/focus/motivation-videos.tsx`). Do not embed audio-only YouTube iframes.
4. **Desktop & Web Sync**: Keep `package.json` version, desktop release tags, and landing page download links synchronized as outlined in `CLAUDE.md`.
