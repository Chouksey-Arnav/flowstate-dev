const { app, BrowserWindow, shell, Tray, Menu, nativeImage, ipcMain } = require("electron");
const path = require("path");

// The desktop app is a thin native shell around the deployed FlowState web
// app — there's no separate desktop codebase to keep in sync. Point
// FLOWSTATE_URL at a local dev server while working on the shell itself.
const BASE_URL = (process.env.FLOWSTATE_URL || "https://flowstate-dev.vercel.app").replace(/\/+$/, "");
// Load /login instead of the marketing homepage: the desktop app has no use
// for the landing page, and middleware.ts already bounces a signed-in
// visitor from /login straight to /dashboard, so this lands authenticated
// users on the dashboard and everyone else on the login/signup screen.
const APP_URL = `${BASE_URL}/login`;

const ICON_PATH = path.join(__dirname, "build", "icon.png");

let mainWindow;
let tray;

// Mirrors the renderer's pomodoroStore state, pushed over IPC on every
// tick (see electron/preload.js + components/layout/pomodoro-engine.tsx).
// Kept here so the tray's context menu can render current status.
let pomodoroState = { running: false, phase: "work", remainingMs: 0 };

const PHASE_ICON = { work: "🎯", break: "☕", longBreak: "🌿" };

function formatTrayTime(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function showMainWindow() {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  } else {
    createWindow();
  }
}

function buildTrayMenu() {
  return Menu.buildFromTemplate([
    {
      label: pomodoroState.running
        ? `${PHASE_ICON[pomodoroState.phase]} ${formatTrayTime(pomodoroState.remainingMs)} remaining`
        : "No timer running",
      enabled: false,
    },
    { type: "separator" },
    {
      label: pomodoroState.running ? "Pause" : "Resume",
      enabled: pomodoroState.running || pomodoroState.remainingMs > 0,
      click: () => mainWindow?.webContents.send("pomodoro:toggle-request"),
    },
    { label: "Open FlowState", click: showMainWindow },
    { type: "separator" },
    { label: "Quit FlowState", role: "quit" },
  ]);
}

function createTray() {
  // Menu bar icons need to be small — the packaged app icon is much larger,
  // so it's resized down rather than shipping a second icon asset.
  const icon = nativeImage.createFromPath(ICON_PATH).resize({ width: 18, height: 18 });
  tray = new Tray(icon);
  tray.setToolTip("FlowState");
  tray.on("click", showMainWindow);
  tray.setContextMenu(buildTrayMenu());
}

// Called on every tick from the renderer (~4x/sec while a timer runs) so the
// menu bar stays live without the main process needing its own clock.
function updateTray(nextState) {
  const phaseOrRunningChanged =
    nextState.phase !== pomodoroState.phase || nextState.running !== pomodoroState.running;
  pomodoroState = nextState;
  if (!tray) return;

  // Tray.setTitle (text next to the icon) is macOS-only; other platforms
  // fall back to the tooltip + context menu for status.
  if (process.platform === "darwin") {
    tray.setTitle(pomodoroState.running ? `${PHASE_ICON[pomodoroState.phase]} ${formatTrayTime(pomodoroState.remainingMs)}` : "");
  }
  tray.setToolTip(
    pomodoroState.running ? `FlowState — ${formatTrayTime(pomodoroState.remainingMs)} remaining` : "FlowState"
  );
  if (phaseOrRunningChanged) tray.setContextMenu(buildTrayMenu());
}

ipcMain.on("pomodoro:update", (_event, state) => updateTray(state));

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#0a0a0f",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    // Packaged builds get their icon from electron-builder; this covers the
    // taskbar/dock icon when running unpackaged via `npm run electron:dev`.
    icon: ICON_PATH,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      // Named + persistent: session cookies (Supabase auth) are written to
      // disk under this partition and survive app restarts, force-quits,
      // and OS reboots — same "stay signed in" behavior as a browser,
      // since login state lives in cookies the account website also uses.
      partition: "persist:flowstate",
    },
  });

  mainWindow.loadURL(APP_URL);

  // If the remote app fails to load (no network and nothing cached yet by
  // the service worker from a previous online session), fall back to a
  // bundled local page instead of Electron's default net-error screen.
  mainWindow.webContents.on("did-fail-load", (_event, errorCode) => {
    if (errorCode === -3) return; // ERR_ABORTED, e.g. a superseded navigation
    mainWindow.loadFile(path.join(__dirname, "offline.html"));
  });

  // Open target="_blank" links (e.g. the GitHub link) in the OS browser
  // instead of a second app window.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
