# CLAUDE.md

Guidance for Claude Code, Jules, and other AI agents working in this repository.

## 🧭 Fast Navigation & Repository Architecture

For a complete map of all repository files, routes, Zustand state stores, UI components, and business logic organized by feature, consult **[`NAVIGATION.md`](./NAVIGATION.md)**. Always check `NAVIGATION.md` first to locate exact files for feature updates and save token usage.

---

## 🚀 Common Commands Cheat Sheet

- **Development Server**: `npm run dev` (Runs locally at http://localhost:3000)
- **TypeScript Check**: `npm run typecheck` (`tsc --noEmit`)
- **Linter**: `npm run lint` (`next lint`)
- **Production Build**: `npm run build`
- **Electron Shell**: `npm run electron:dev` (runs shell against local Next.dev server)
- **Desktop Packages**: `npm run dist:mac`, `npm run dist:win`, `npm run dist:linux`

---

## 🔑 Architecture Highlights & Key Principles

### 1. State Management & KV Persistence (`store/` & `lib/supabase/`)
- Domain state (Tasks, Habits, Focus Sessions, XP, Settings, Reflections, Blocker Prefs) uses Zustand with `persist` middleware.
- Data syncs with Supabase Postgres table `flowstate_kv` via `lib/supabase/kvStorage.ts`.
- Fallback: If Supabase credentials are missing or offline, stores transparently fall back to client-side `localStorage`.
- Note: Live running Pomodoro timer state (`pomodoroStore.ts`) stays strictly in `localStorage`.

### 2. UI & Styling System
- Built with Tailwind CSS v3, Radix UI primitives (`components/ui/`), and Framer Motion.
- Uses glassmorphism styling (`glass-panel`, `glass-morphism`) defined in `app/globals.css`.
- Uses HSL-based CSS variables (e.g., `--primary`, `--accent`, `--card`, `--background`).

### 3. Web Audio Synthesis (`lib/audio.ts`)
- All timer alarms and ambient noise (lofi, rain, white/brown noise) are dynamically synthesized client-side using Web Audio API.
- Do not add external audio files or third-party audio embeds.

### 4. YouTube Embeds Strategy
- Only Dan Martell's motivation clips (`components/focus/motivation-videos.tsx`) are embedded in the app.
- Do not add other YouTube embeds (e.g. ambient video) back in — they were intentionally removed since embedded YouTube iframes require a live network connection and break offline mode.

### 5. Offline & Desktop Support
- Web app uses a PWA service worker (`public/sw.js`, registered in `components/pwa-register.tsx`) to cache app shell and static assets. API/Auth requests are intentionally not cached.
- Electron desktop app (`electron/main.js`) wraps the web app in a persistent browser window. Fallback for no network on first launch is `electron/offline.html`.

---

## 📌 Landing Page Version Sync Rule

Every time you push a change to `main` that results in a new release of the app — for the **macOS (.dmg)**, **Windows (.exe)**, **Linux (.AppImage)** desktop builds, *and* the **web app** — you must keep version info in sync:

- Bump `"version"` in `package.json` to match the new release tag.
- If/when a version badge or "vX.Y.Z" string is added to the landing page (`app/page.tsx` and `components/marketing/`), update it in the same commit.
- Double check `public/manifest.json` and `CACHE_VERSION` in `public/sw.js` — bump `CACHE_VERSION` whenever a release changes cached static assets.
