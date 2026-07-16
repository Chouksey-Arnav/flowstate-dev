const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

// The desktop app is a thin native shell around the deployed FlowState web
// app — there's no separate desktop codebase to keep in sync. Point
// FLOWSTATE_URL at a local dev server while working on the shell itself.
const APP_URL = process.env.FLOWSTATE_URL || "https://flowstate-dev.vercel.app";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#0a0a0f",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
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
