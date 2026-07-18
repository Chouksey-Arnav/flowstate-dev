# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repo.

## Note to future agents: keep the landing page version in sync

Every time you push a change to `main` that results in a new release of the
app — for the **macOS (.dmg)**, **Windows (.exe)**, **Linux (.AppImage)**
desktop builds, *and* the **web app** — you must also update the version
info shown on the landing page (`app/page.tsx` and the marketing components
under `components/marketing/`, e.g. `hero-section.tsx`,
`final-cta-section.tsx`, `desktop-download-button.tsx`) so it matches what
users actually get if they download/reload right now:

- Bump `"version"` in `package.json` to match the new release tag.
- If/when a version badge or "vX.Y.Z" string is added to the landing page,
  update it in the same commit as the release — don't let it drift.
- The desktop download buttons already point at
  `GITHUB_REPO_URL/releases/latest/download/...` (see `lib/site.ts`), which
  always resolves to the newest GitHub release automatically — no link
  changes needed there, just make sure the release the workflow publishes
  actually has that tag/version.
- Double check `public/manifest.json` and the service worker cache name in
  `public/sw.js` (`CACHE_VERSION`) — bump `CACHE_VERSION` whenever a
  release changes cached static assets, so returning users' service workers
  invalidate old caches instead of serving stale offline content.

Do this as part of the same change, not as a follow-up — a landing page
advertising an old version (or serving a stale offline cache) is a bug.

## Offline support

- The web app registers a service worker (`public/sw.js`, registered via
  `components/pwa-register.tsx`) that caches the app shell and static
  assets so previously visited pages keep working without a network
  connection. API/auth requests (Supabase, `/api/*`) are intentionally
  never cached — those features require a live connection.
- The Electron desktop app (`electron/main.js`) is a thin shell that loads
  the deployed web app in a `BrowserWindow` with a persistent session
  partition, so the same service worker and its caches apply there too —
  once a user has opened the app online, previously visited screens keep
  working offline. If the very first launch has no network at all (nothing
  cached yet), it falls back to `electron/offline.html` instead of
  Electron's default network-error page.

## YouTube embeds

- Only Dan Martell's motivation clips (`components/focus/motivation-videos.tsx`)
  are embedded in the app. Do not add other YouTube embeds (e.g. ambient/lofi
  video) back in — they were intentionally removed since embedded YouTube
  iframes require a live network connection and don't work offline.
