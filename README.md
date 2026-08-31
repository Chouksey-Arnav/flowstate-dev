# FlowState

A dark-themed, no-excuses anti-procrastination productivity app. Tasks, a Pomodoro focus timer, habits, stats, and a dashboard that ties them together — all running entirely in your browser.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS v3** with hand-written shadcn-style UI primitives (Radix UI under the hood)
- **Zustand** with `persist` for state, seven independent domain stores (tasks, habits, focus sessions, settings, xp, reflections, blocker prefs) — persisted to Supabase instead of localStorage, see below
- **Supabase** (Postgres + Auth + Edge Functions) for accounts and cross-device sync
- **Recharts** for the weekly bar chart and category donut
- **Framer Motion** for page transitions and list animations
- **Web Audio API** for all timer/completion/ambient sounds — synthesized client-side, no audio files or third-party embeds
- **canvas-confetti** for task-completion celebrations

## Accounts & data storage

FlowState has real accounts: a username (always displayed with a leading `@`, e.g. `@arnav`) and a password. Usernames are globally unique (case-insensitive) and can be changed any time from Settings → Account. Logging in from any device signs you into that same account and pulls your data — nothing is tied to a single browser or machine.

Under the hood:

- **Auth**: Supabase Auth. Since Supabase's auth system is keyed on email, each account gets an internal, never-shown synthetic email (`<uuid>@flowstate.internal`) that the username maps to — password hashing, sessions, and JWTs are all handled by Supabase.
- **Signup / login / username change** run through three Supabase Edge Functions (`flowstate-signup`, `flowstate-login`, `flowstate-change-username`) rather than the browser, so the service-role key needed to create accounts and resolve usernames never touches client code.
- **App data** (tasks, habits, focus sessions, settings, XP, reflections, blocker prefs) is stored in a Postgres table (`flowstate_kv`) as one JSON row per store per account, gated by row-level security so a user can only ever read or write their own rows. Each Zustand store's `persist` middleware points at this table instead of `localStorage`, so the existing store code barely changed.
- The **live-running Pomodoro timer state** intentionally stays in `localStorage` — it's per-device, per-tab UI state, not account data worth syncing.
- All of this lives in a `flowstate_`-prefixed schema inside a shared Supabase project, isolated from that project's other, unrelated tables.

Use Settings → Export data as JSON to back up your data locally at any time.

## Getting started

```bash
npm install
npm run dev
```

Requires a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page (or get redirected straight to `/dashboard` if you're already signed in).

Other useful scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run build       # production build
```

## Features

- **Dashboard** — greeting, day-of-year counter, task streak, editable daily goal, top 3 tasks, an independent mini Pomodoro widget, a rotating motivational quote, habit status dots, a mini weekly chart, and quick-add.
- **Tasks** — full CRUD with subtasks, categories, priorities, due dates, filtering/sorting, manual drag-to-reorder, brain-dump rapid entry, archive view, bulk actions, an optional personal reward per task, and confetti + chime + undo toast on completion.
- **Focus** — a drift-free Pomodoro timer (work/break/long-break), an SVG ring display, a session log, a "Watch all" lofi video grid, a distraction-free Full Focus Mode, and ambient sound (lofi/rain/white/brown noise, all synthesized).
- **Habits** — weekly completion grid, streaks (current + best), a Perfect Day badge, drag-to-reorder, six pre-loaded defaults, and a large tap-to-check-off panel front-and-center on the dashboard.
- **Stats** — completion/focus-time/habit-rate/streak stat cards, a category donut, a weekly bar chart, and a CSS-grid monthly heatmap with month navigation.
- **Settings** — account (username, change username, log out), profile, Pomodoro durations and timer sound, behavior toggles (confetti, sound, auto-start, first day of week), and data actions (JSON export, clear completed, reset habit streaks, reset everything).

Responsive down to mobile widths: the sidebar collapses below `md` in favor of a bottom tab bar.

## Docs

The full documentation site lives at `/docs` (linked from the landing page nav and footer) — a dedicated write-up for every tool: Tasks, Rewards, Focus, Habits, Stats, Gamification & XP, the Site Blocker, Settings & Data, Accounts & Sync, and Privacy & Self-Hosting. It's public regardless of login state, unlike the rest of the app.

For developer and AI agent navigation through the codebase:
- **[NAVIGATION.md](./NAVIGATION.md)** — Token-optimized repository map and quick feature-to-file directory.
- **[AGENT_INDEX.md](./AGENT_INDEX.md)** — Ultra-dense line-by-line file manifest and Task-to-File Action Matrix for AI agents.
- **[CLAUDE.md](./CLAUDE.md)** — Core engineering guidelines, design principles, and command cheat sheet for AI agents.

## Deploying

Vercel-ready. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables on the Vercel project (same values as `.env.local`), then push — no other server-side config needed.

## Desktop app

The "Get for Mac" button on the landing page ships a native desktop shell (`electron/`) — an Electron `BrowserWindow` that loads the deployed web app, so there's no separate desktop codebase to maintain. It builds to a real `.dmg`/`.exe`/`.AppImage` via `electron-builder`:

```bash
npm run electron:dev   # run the shell against your local `next dev` server
npm run dist:mac       # build release/FlowState.dmg (must run on macOS)
npm run dist:win       # build release/FlowState-Setup.exe
npm run dist:linux     # build release/FlowState.AppImage
```

`.github/workflows/desktop-release.yml` builds all three platforms on their native runners and attaches the artifacts to a GitHub Release whenever a `desktop-v*` tag is pushed (or via manual dispatch) — `mac`/`win`/`dmg` builds require their native OS, which is why this can't be done from a single machine. The landing-page buttons link to `releases/latest/download/<name>`, a stable GitHub URL that always points at the newest release's asset, so no code changes are needed when cutting a new desktop release.

### Code signing (removing the macOS "Apple could not verify" warning)

Unsigned, the `.dmg` triggers Gatekeeper's "not opened" warning on first launch — expected until the app is signed with an Apple Developer ID certificate and notarized. `electron-builder.js` and the release workflow already support this; it's disabled only because the credentials aren't present. To turn it on, add these 5 repo secrets (Settings → Secrets and variables → Actions), all sourced from a paid [Apple Developer Program](https://developer.apple.com/programs/) membership:

| Secret | What it is |
| --- | --- |
| `MAC_CERTIFICATE_P12_BASE64` | Base64-encoded `.p12` export of a "Developer ID Application" certificate (Keychain Access → export) |
| `MAC_CERTIFICATE_PASSWORD` | The password set when exporting that `.p12` |
| `APPLE_ID` | The Apple ID email enrolled in the Developer Program |
| `APPLE_APP_SPECIFIC_PASSWORD` | An app-specific password for that Apple ID, generated at appleid.apple.com |
| `APPLE_TEAM_ID` | Your 10-character Developer Team ID |

Once all 5 are set, the next desktop-release run signs and notarizes the `.dmg` automatically — no code changes needed. Without them, it builds unsigned exactly as it does today.
