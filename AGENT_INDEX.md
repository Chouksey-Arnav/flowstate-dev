# AGENT_INDEX.md - Exhaustive AI Agent File Index & Action Guide

This file is an ultra-dense, token-optimized repository manifest specifically crafted for AI Agents (Claude Code, Jules, Cursor, etc.). It indexes all 214 files in the repository and provides direct task-to-file action maps so agents can locate target files instantly without filesystem scanning.

---

## ⚡ Task-to-File Action Matrix

When assigned a task, consult this table to identify every file you need to inspect or modify:

| Task / Goal | Files to Edit / Inspect |
| :--- | :--- |
| **Add a field to Task model** | `types/index.ts` → `store/taskStore.ts` → `components/tasks/form-dialog.tsx` → `components/tasks/item.tsx` |
| **Modify Task sorting / filtering** | `lib/tasks.ts` → `lib/overdue.ts` → `components/tasks/filters.tsx` → `components/tasks/sort-control.tsx` → `store/taskStore.ts` |
| **Change Pomodoro timer behavior** | `store/pomodoroStore.ts` → `hooks/usePomodoro.ts` → `components/layout/pomodoro-engine.tsx` → `components/focus/pomodoro-ring.tsx` |
| **Add/Modify ambient audio or chimes** | `lib/audio.ts` → `hooks/useAmbientSound.ts` → `components/focus/ambient-sound-control.tsx` → `components/settings/pomodoro-section.tsx` |
| **Add a new Habit property** | `types/index.ts` → `store/habitStore.ts` → `lib/habits.ts` → `components/habits/habit-form-dialog.tsx` → `components/habits/habit-item.tsx` |
| **Modify Gamification / XP rules** | `lib/xp.ts` → `lib/badges.ts` → `store/xpStore.ts` → `components/gamification/xp-bar.tsx` → `components/gamification/level-up-modal.tsx` |
| **Add/Modify Stats & Analytics** | `lib/stats.ts` → `components/stats/stat-card.tsx` → `components/stats/weekly-bar-chart.tsx` → `components/stats/category-donut.tsx` → `components/stats/heatmap.tsx` |
| **Update User Settings / Preferences** | `types/index.ts` → `store/settingsStore.ts` → `components/settings/` (`account-section`, `behavior-section`, `pomodoro-section`, `data-section`, `blocker-section`) |
| **Modify Auth, Login or Usernames** | `lib/auth/actions.ts` → `components/auth/username-field.tsx` → `app/(auth)/login/page.tsx` → `app/(auth)/signup/page.tsx` → `supabase/functions/*` |
| **Modify Supabase Data Persistence** | `lib/supabase/kvStorage.ts` → `lib/supabase/client.ts` → `lib/supabase/server.ts` → `lib/supabase/middleware.ts` |
| **Update Desktop Electron Shell** | `package.json` → `electron-builder.js` → `electron/main.js` → `electron/preload.js` → `electron/offline.html` → `lib/site.ts` |
| **Update OS Site Blocker Script** | `lib/blockerScript.ts` → `store/blockerStore.ts` → `components/settings/blocker-section.tsx` → `scripts/blocker/flowstate-block.sh` |
| **Modify Landing Page or Marketing** | `app/page.tsx` → `components/marketing/*` → `lib/site.ts` → `lib/desktop-install.ts` |
| **Modify Documentation Hub** | `lib/docs.ts` → `app/docs/page.tsx` → `app/docs/[slug]/page.tsx` → `components/docs/*` |
| **Update Global Design & Utility Styles** | `app/globals.css` → `tailwind.config.ts` → `components/ui/*` |

---

## 🗂 Line-by-Line File Manifest

### Root Configuration & Documentation Files
- `.eslintrc.json`: ESLint configuration extending `next/core-web-vitals`.
- `.gitignore`: Git ignore patterns for dependencies, builds, environment variables, and OS metadata.
- `BLOCKER_DEBUG_GUIDE.md`: Diagnostic operating system guide for testing and debugging the `/etc/hosts` site blocker script on macOS/Linux.
- `CLAUDE.md`: High-level AI agent instructions, release sync rules, and development command cheat sheet.
- `NAVIGATION.md`: Human- and AI-readable fast navigation map and architectural lookup directory.
- `README.md`: Public project overview, feature breakdown, setup instructions, architecture notes, and desktop build documentation.
- `components.json`: Shadcn UI CLI configuration defining component paths, aliases, and Tailwind parameters.
- `electron-builder.js`: Electron packaging configuration for macOS (.dmg), Windows (.exe), and Linux (.AppImage).
- `middleware.ts`: Next.js root middleware invoking Supabase session refreshes on app requests.
- `next.config.mjs`: Next.js configuration enabling PWA capabilities and build optimizations.
- `package.json`: Project dependencies, scripts, and release version declaration.
- `package-lock.json`: Locked dependency tree for npm installations.
- `postcss.config.js`: PostCSS configuration for Tailwind CSS processing.
- `tailwind.config.ts`: Tailwind CSS configuration defining theme colors, HSL CSS variables, custom animations, and glassmorphism plugins.
- `tsconfig.json`: TypeScript compiler settings and path aliases (`@/*`).
- `vercel.json`: Deployment overrides and header rules for Vercel/Coolify static hosting.

---

### App Router Pages & Layouts (`app/`)
- `app/layout.tsx`: Root layout configuring Geist fonts, global providers, TooltipProvider, HydrationGate, and global PomodoroEngine.
- `app/globals.css`: Global styles, dark theme HSL color variables (`--background`, `--primary`, etc.), custom glassmorphism utilities (`glass-panel`), and scrollbar styles.
- `app/page.tsx`: Public landing page assembling marketing sections (`HeroSection`, `FeaturesSection`, `GamificationSection`, etc.).
- `app/robots.ts`: SEO robots text generator defining crawler permissions.
- `app/sitemap.ts`: Dynamic sitemap generator outputting XML routes for search engines.

#### App Views (`app/(app)/`)
- `app/(app)/layout.tsx`: Authenticated app layout rendering collapsible `Sidebar` (desktop) and `MobileNav` (mobile).
- `app/(app)/dashboard/page.tsx`: Core overview dashboard combining daily goal, progress cards, top tasks, habits, mini Pomodoro, and quote widgets.
- `app/(app)/tasks/page.tsx`: Task manager page supporting task listing, subtasks, brain dump entry, archive view, filtering, and drag reordering.
- `app/(app)/focus/page.tsx`: Pomodoro focus page featuring SVG timer ring, ambient sound mixer, YouTube lofi clips, and full focus mode toggle.
- `app/(app)/habits/page.tsx`: Habit tracking view with weekly completion grid, flame streak badges, and habit form dialog.
- `app/(app)/stats/page.tsx`: Productivity analytics dashboard with stat summary cards, weekly bar chart, category donut, and monthly heatmap.
- `app/(app)/settings/page.tsx`: User preferences control panel featuring Account, Profile, Behavior, Timer, Data, and Blocker sections.

#### Auth Pages (`app/(auth)/`)
- `app/(auth)/layout.tsx`: Shared centered layout container for login and signup pages.
- `app/(auth)/login/layout.tsx` & `page.tsx`: Login view with synthetic email resolution, password visibility toggles, and authentication error handling.
- `app/(auth)/signup/layout.tsx` & `page.tsx`: Account creation view with real-time username availability validation and password confirmation.

#### Public Documentation Site (`app/docs/`)
- `app/docs/layout.tsx`: Documentation shell rendering topbar and responsive sidebar layout.
- `app/docs/page.tsx`: Documentation overview hub displaying card grid of doc categories.
- `app/docs/[slug]/page.tsx`: Dynamic markdown documentation renderer for specific feature guides.

---

### UI & Layout Components (`components/`)

#### Primitives (`components/ui/`)
- `components/ui/button.tsx`: Custom Button component built on Radix Slot, filtering Framer Motion props on `asChild`.
- `components/ui/card.tsx`: Glassmorphism-styled Card, CardHeader, CardTitle, CardDescription, and CardContent.
- `components/ui/dialog.tsx`: Radix Dialog primitive styled with glassmorphism overlay and animation modals.
- `components/ui/dropdown-menu.tsx`: Radix DropdownMenu for context menus and action dropdowns.
- `components/ui/input.tsx`: Styled text input primitive.
- `components/ui/password-input.tsx`: Input field wrapper with integrated interactive Eye/EyeOff password visibility toggle.
- `components/ui/label.tsx`: Accessible form label primitive based on Radix Label.
- `components/ui/popover.tsx`: Radix Popover primitive for floating dialogs and pickers.
- `components/ui/select.tsx`: Custom select menu built on Radix Select.
- `components/ui/slider.tsx`: Radix Slider primitive for volume and duration adjustments.
- `components/ui/switch.tsx`: Radix Switch primitive for boolean settings.
- `components/ui/textarea.tsx`: Multi-line text entry primitive.
- `components/ui/tooltip.tsx`: Radix Tooltip hover helper primitive.
- `components/ui/badge.tsx`: Category and status badge UI pill component.
- `components/ui/empty-state.tsx`: Reusable fallback card display when lists or queries return zero items.

#### Application Shell & Layout (`components/layout/`)
- `components/layout/sidebar.tsx`: Collapsible desktop side navigation panel with active route highlighting and Pomodoro status pill.
- `components/layout/mobile-nav.tsx`: Fixed bottom tab bar for mobile viewports (`< md`).
- `components/layout/hydration-gate.tsx`: Client-side hydration wrapper delaying render until Zustand persisted stores hydrate.
- `components/layout/pomodoro-engine.tsx`: Invisible background listener handling timer tick intervals and auto-phase switches.
- `components/layout/pomodoro-status-pill.tsx`: Compact header pill displaying running timer status.
- `components/layout/page-transition.tsx`: Framer Motion wrapper adding smooth fade/slide transitions on page navigation.
- `components/layout/splash-skeleton.tsx`: Full-screen skeleton loading fallback during initial auth check.

#### Dashboard Widgets (`components/dashboard/`)
- `components/dashboard/greeting.tsx`: User greeting banner with dynamic time-of-day message and display name.
- `components/dashboard/date-counter.tsx`: Small calendar widget showing current day of the year (e.g., "Day 142 of 365").
- `components/dashboard/level-hero-card.tsx`: Gamification hero banner displaying user level, XP bar, current title, and level-up progress.
- `components/dashboard/daily-goal-editable.tsx`: Editable daily task target counter with click-to-edit inline input.
- `components/dashboard/today-progress-card.tsx`: Card summarizing tasks completed today versus daily target with progress bar.
- `components/dashboard/goal-progress-card.tsx`: Urgency-aware card evaluating whether daily task goal is met, on track, or falling behind.
- `components/dashboard/top-tasks-card.tsx`: Quick view card displaying top 3 priority tasks due today with check-off actions.
- `components/dashboard/avoided-tasks-card.tsx`: Procrastination nudge card highlighting tasks repeatedly skipped or delayed.
- `components/dashboard/pomodoro-mini-widget.tsx`: Compact focus timer widget on dashboard with quick play/pause controls.
- `components/dashboard/habit-status-row.tsx`: Interactive horizontal row of habit check-off bubbles for rapid daily check-ins.
- `components/dashboard/streak-card.tsx`: Card displaying current task and habit streaks with flame indicators.
- `components/dashboard/streak-warning-banner.tsx`: Alert banner warning user if daily habit or task streak is at risk of breaking.
- `components/dashboard/commitment-card.tsx`: Focus commitment card displaying user's selected focus task and target session count.
- `components/dashboard/reflection-insight-card.tsx`: Card displaying end-of-day reflection summary and top procrastination reason insights.
- `components/dashboard/next-badge-strip.tsx`: Horizontal strip displaying nearest unearned gamification badges and unlock conditions.
- `components/dashboard/weekly-chart-mini.tsx`: Mini sparkline bar chart on dashboard summarizing weekly task completion trends.
- `components/dashboard/motivational-quote.tsx`: Rotating motivational quote card with manual refresh button.
- `components/dashboard/daily-reminder-card.tsx`: Dynamic notification card encouraging check-ins based on time of day.
- `components/dashboard/quick-add-button.tsx`: Floating or inline quick-add action triggering task or habit creation dialogs.
- `components/dashboard/section-heading.tsx`: Reusable section title component with optional icon and description.

#### Task Management Components (`components/tasks/`)
- `components/tasks/list.tsx`: Reusable task list renderer supporting Framer Motion reorder animations and subtask trees.
- `components/tasks/item.tsx`: Task row component with check-off box, priority badge, subtask toggle, and action dropdown.
- `components/tasks/filters.tsx`: Filter tab bar (All, Active, Completed, Category, Priority) for filtering task list.
- `components/tasks/sort-control.tsx`: Dropdown select controlling task sorting (Due Date, Priority, XP, Manual).
- `components/tasks/form-dialog.tsx`: Modal dialog for creating and editing tasks (title, description, due date, priority, category, XP).
- `components/tasks/subtask-list.tsx`: Interactive subtask list inside task card with inline add input and check toggles.
- `components/tasks/brain-dump-input.tsx`: Multi-line rapid text input for dumping multiple tasks separated by line breaks.
- `components/tasks/brain-dump-review-dialog.tsx`: Review modal for parsed brain-dump lines allowing category and priority assignment before saving.
- `components/tasks/archive-view.tsx`: View list displaying archived tasks with restore and delete actions.
- `components/tasks/bulk-actions-bar.tsx`: Floating action bar appearing when multiple tasks are selected (bulk complete, bulk delete).
- `components/tasks/momentum-bar.tsx`: Visual progress bar showing daily task completion momentum.
- `components/tasks/focus-pick-card.tsx`: Card allowing quick selection of a task to attach to the next Pomodoro focus session.
- `components/tasks/skip-reason-dialog.tsx`: Modal prompting for a procrastination reason when skipping or deleting an active task.
- `components/tasks/no-tasks-nudge.tsx`: Empty-state visual prompting user to create their first task or start a brain dump.
- `components/tasks/undo-toast.tsx`: Toast notification allowing immediate undo of a task completion or deletion.
- `components/tasks/category-badge.tsx`: Colored badge indicating task category (Work, Personal, Health, Coding, etc.).
- `components/tasks/priority-badge.tsx`: Colored priority badge (High, Medium, Low).
- `components/tasks/difficulty-badge.tsx`: Difficulty rating indicator (Easy, Medium, Hard).
- `components/tasks/overdue-badge.tsx`: Red alert badge indicating a task past its due date.
- `components/tasks/avoided-badge.tsx`: Warning badge indicating a task that has been skipped multiple times.
- `components/tasks/pill-select.tsx`: Custom horizontal pill selection button group for forms.

#### Focus & Ambient Components (`components/focus/`)
- `components/focus/pomodoro-ring.tsx`: Dynamic SVG circular progress ring animating timer countdown.
- `components/focus/pomodoro-widget.tsx`: Primary Pomodoro control panel (play/pause, skip phase, time display).
- `components/focus/full-focus-mode.tsx`: Distraction-free full-screen overlay mode hiding all sidebar and UI elements.
- `components/focus/ambient-sound-control.tsx`: Audio mixer component for toggling and controlling volume of synthesized ambient sounds.
- `components/focus/motivation-videos.tsx`: Embedded Dan Martell motivation YouTube videos section.
- `components/focus/session-task-picker.tsx`: Selector dialog for linking active tasks to a focus session.
- `components/focus/intention-dialog.tsx`: Modal prompting for single session intention before starting timer.
- `components/focus/video-embed.tsx`: Safe iframe wrapper component for video embeds.

#### Habit Tracking Components (`components/habits/`)
- `components/habits/habit-list.tsx`: Main habit list container managing grid layout and reordering.
- `components/habits/habit-item.tsx`: Habit item card featuring daily check-in button, current streak, best streak, and edit modal trigger.
- `components/habits/weekly-grid.tsx`: 7-day visual check-in grid displaying completion history across the current week.
- `components/habits/habit-form-dialog.tsx`: Creation and edit dialog for habit title, icon selection, frequency, and target goal.
- `components/habits/streak-flame.tsx`: Flame icon component with numerical streak counter changing color based on streak length.
- `components/habits/perfect-day-badge.tsx`: Badge component awarded when all scheduled habits for a day are completed.

#### Stats & Analytics Components (`components/stats/`)
- `components/stats/stat-card.tsx`: Metric card displaying total focus minutes, tasks completed, completion rate, or active streak.
- `components/stats/weekly-bar-chart.tsx`: Recharts bar chart showing daily focus time or completed tasks across the past week.
- `components/stats/category-donut.tsx`: Recharts donut pie chart displaying task breakdown across categories.
- `components/stats/heatmap.tsx`: Monthly CSS grid activity heatmap showing daily productivity intensity.
- `components/stats/badge-case.tsx`: Grid view displaying earned and locked gamification achievement badges.

#### Settings Components (`components/settings/`)
- `components/settings/account-section.tsx`: User account details, username change form, email view, and log out button.
- `components/settings/profile-section.tsx`: Profile display name and avatar customization settings.
- `components/settings/behavior-section.tsx`: App behavior toggles (confetti celebrations, chime audio, auto-start timer, first day of week).
- `components/settings/pomodoro-section.tsx`: Duration sliders for work duration, short break, long break, and long break interval count.
- `components/settings/data-section.tsx`: Data management actions (JSON backup download, JSON restore, clear completed tasks, hard reset).
- `components/settings/blocker-section.tsx`: Distraction site domain management, schedule settings, and script download buttons.
- `components/settings/confirm-dialog.tsx`: Reusable destructive action confirmation modal.

#### Gamification Components (`components/gamification/`)
- `components/gamification/xp-bar.tsx`: Header progress bar displaying user level, current XP, and XP needed for next level.
- `components/gamification/level-up-modal.tsx`: Animated reward modal triggering confetti celebration when user levels up.
- `components/gamification/streak-milestone-modal.tsx`: Milestone alert modal celebrating major streak achievements (e.g., 7-day, 30-day streak).
- `components/gamification/xp-toast-stack.tsx`: Floating notification toast queue displaying instant XP gains (e.g., "+25 XP Task Completed").

#### Marketing & Public Components (`components/marketing/`)
- `components/marketing/hero-section.tsx`: Landing page hero banner with headline, CTA buttons, and desktop download links.
- `components/marketing/app-preview.tsx`: Mock preview frame showcasing FlowState UI.
- `components/marketing/features-section.tsx`: Feature grid highlighting Tasks, Focus, Habits, Stats, and Blocker.
- `components/marketing/feature-row.tsx`: Alternating feature showcase row with screenshot/illustration.
- `components/marketing/gamification-section.tsx`: Landing section showcasing level-up rewards, streaks, and badges.
- `components/marketing/manifesto-section.tsx`: Anti-procrastination design manifesto section.
- `components/marketing/quote-marquee.tsx`: Scrolling marquee section displaying productivity principles.
- `components/marketing/tech-stack-section.tsx`: Section detailing tech stack (Next.js, Supabase, Tailwind, Zustand, Web Audio).
- `components/marketing/docs-section.tsx`: Section spotlighting user guides and documentation.
- `components/marketing/open-source-section.tsx`: Open-source and GitHub repository link section.
- `components/marketing/privacy-section.tsx`: Privacy guarantee highlighting local storage fallback and encryption.
- `components/marketing/faq-section.tsx`: Accordion list answering frequently asked questions.
- `components/marketing/final-cta-section.tsx`: Bottom conversion banner with quick start button.
- `components/marketing/site-nav.tsx`: Public header navbar with logo, docs link, and login/signup buttons.
- `components/marketing/site-footer.tsx`: Footer with page links, docs index, desktop downloads, and copyright.
- `components/marketing/first-visit-tip.tsx`: First-time visitor welcome tooltip banner.
- `components/marketing/desktop-download-button.tsx`: OS-detecting button offering direct `.dmg`, `.exe`, or `.AppImage` downloads.
- `components/marketing/github-star-button.tsx`: GitHub repository star counter button.
- `components/marketing/logo-mark.tsx`: FlowState logo mark SVG component.

#### Documentation & Auth Components
- `components/docs/docs-topbar.tsx`: Header navigation bar for documentation site.
- `components/docs/docs-sidebar.tsx`: Responsive navigation sidebar listing documentation sections.
- `components/docs/doc-content.tsx`: Structured Markdown-style doc renderer with callouts and code blocks.
- `components/auth/username-field.tsx`: Interactive username input field with live availability checking spinner and error message.
- `components/pwa-register.tsx`: Client component registering service worker (`/sw.js`) for PWA support.

---

### State Stores (`store/`)
- `store/taskStore.ts`: Task CRUD actions, subtask state, filter options, task archiving, and reordering.
- `store/pomodoroStore.ts`: Active timer tick state (phase, remaining seconds, play status). Strictly stored in `localStorage`.
- `store/focusStore.ts`: Historical focus session logs, session tags, and total focus duration aggregations.
- `store/habitStore.ts`: Habit definitions, frequency settings, and completion date sets.
- `store/streakStore.ts`: Current and longest streaks for daily tasks and habits.
- `store/xpStore.ts`: User experience points, current level, total earned XP, and level-up calculations.
- `store/xpToastStore.ts`: State queue managing non-blocking floating XP gain toasts.
- `store/settingsStore.ts`: App options (Pomodoro durations, auto-start, ambient sound levels, theme preferences).
- `store/reflectionStore.ts`: Daily reflection entries, procrastination skip reasons, and reflection history.
- `store/blockerStore.ts`: Blocked domains list, custom schedule windows, and script output configuration.

---

### Utilities, Business Logic & Helpers (`lib/` & `hooks/`)

#### Pure Helper Modules (`lib/`)
- `lib/audio.ts`: Synthesizes Web Audio API start/end timer chimes, completion sounds, lofi noise, rain, and white/brown noise.
- `lib/xp.ts`: XP rules matrix for task priorities, difficulties, subtasks, habit check-ins, and level formulas.
- `lib/badges.ts`: Gamification badge definitions, threshold constants, and unlock logic functions.
- `lib/habits.ts`: Habit streak calculation, weekly completion calculation, and perfect day evaluation.
- `lib/streaks.ts`: Multi-domain streak calculation for tasks and habits.
- `lib/tasks.ts`: Task filtering, schedule calculation, drag reorder helpers, and avoidance threshold checking.
- `lib/overdue.ts`: Overdue task check helpers and estimated completion time remaining calculations.
- `lib/stats.ts`: Data aggregations for charts (weekly focus minutes, category counts, daily heatmap matrix).
- `lib/quotes.ts`: Motivational quotes list, hourly quote resolver, and task completion micro-copy strings.
- `lib/dailyGoal.ts`: Target task math and urgency status calculation (`met`, `calm`, `nudge`, `warning`, `critical`).
- `lib/reflection.ts`: Processing skip reasons and procrastination insights.
- `lib/blockerScript.ts`: Generates custom shell scripts (`flowstate-block.sh`) and macOS `launchd` plist files for site blocking.
- `lib/export.ts`: Full JSON payload generator and parser for data export and restoration.
- `lib/docs.ts`: Structured text repository of all documentation articles and slug mapping.
- `lib/site.ts`: Repository links, site URL constants, and desktop download asset URL mappings.
- `lib/desktop-install.ts`: Platform-specific terminal commands for installing desktop packages.
- `lib/dates.ts`: Utility functions for date formatting (`YYYY-MM-DD`), day-of-year calculations, and date comparisons.
- `lib/id.ts`: Safe unique ID generator falling back to `crypto.randomUUID()`.
- `lib/utils.ts`: Tailwind CSS class merge utility (`cn`).

#### Authentication & Supabase (`lib/auth/` & `lib/supabase/`)
- `lib/auth/actions.ts`: Client functions calling Supabase Edge Functions for login, signup, and username changes.
- `lib/supabase/kvStorage.ts`: Zustand `StateStorage` adapter syncing store JSON to Supabase `flowstate_kv` table with `localStorage` fallback.
- `lib/supabase/client.ts`: Supabase browser client builder.
- `lib/supabase/server.ts`: Supabase Server Component client builder.
- `lib/supabase/middleware.ts`: Supabase session update middleware helper.

#### React Hooks (`hooks/`)
- `hooks/usePomodoro.ts`: Facade hook binding `pomodoroStore` actions to UI components.
- `hooks/useAmbientSound.ts`: React hook managing Web Audio ambient sound playback and volume adjustments.
- `hooks/useNowTick.ts`: Minute-interval date tick generator for live updating relative timestamps.
- `hooks/useBodyScrollLock.ts`: Utility hook toggling `overflow: hidden` on body element during modal displays.

---

### Backend Edge Functions & Scripts (`supabase/` & `scripts/`)
- `supabase/config.toml`: Local Supabase development configuration.
- `supabase/functions/flowstate-signup/index.ts`: Edge function creating Supabase auth user with synthetic email mapping to username.
- `supabase/functions/flowstate-login/index.ts`: Edge function verifying username and returning Supabase JWT session.
- `supabase/functions/flowstate-change-username/index.ts`: Edge function updating username mapping in Supabase Postgres.
- `scripts/blocker/flowstate-block.sh`: Executable bash script modifying `/etc/hosts` to redirect blocked domains to `127.0.0.1`.
- `scripts/blocker/README.md`: Terminal installation and troubleshooting instructions for the site blocker script.
- `scripts/indexnow-ping.mjs`: Utility script submitting updated routes to IndexNow search engine protocol.

---

### Electron Shell & Public Assets (`electron/` & `public/`)
- `electron/main.js`: Main process creating BrowserWindow, handling native menus, deep links, and offline fallback.
- `electron/preload.js`: Context isolation preload script exposing secure IPC bridge.
- `electron/offline.html`: Fallback HTML page shown when app launches with no internet connection.
- `electron/build/icon.png`: Application icon asset for desktop packaging.
- `public/manifest.json`: Web App Manifest defining PWA icons, name, display mode, and colors.
- `public/sw.js`: Service worker caching static assets and app shell while bypassing API requests.
- `public/offline.html`: PWA fallback page for offline browser sessions.
- `public/llms.txt`: Machine-readable overview of the project for LLM discovery.
- `public/icon-192.png` & `public/icon-512.png`: App icons for mobile PWA home screen installation.
- `public/8bc2e64af52e4ad88b9ef591a6a83731.txt`: Verification token file for search engine webmaster tools.
- `types/index.ts`: Global TypeScript definitions for Task, SubTask, Habit, FocusSession, UserSettings, ReflectionEntry, and XPState.
