const { app, BrowserWindow, shell } = require("electron");
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

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
