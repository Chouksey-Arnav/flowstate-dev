const { contextBridge, ipcRenderer } = require("electron");

// Bridges the renderer (the hosted web app, running with nodeIntegration
// off) to the main process so the live Pomodoro timer can drive the macOS
// menu bar tray. Kept deliberately narrow: one outbound state push, one
// inbound toggle request.
contextBridge.exposeInMainWorld("flowstateDesktop", {
  updatePomodoro: (state) => ipcRenderer.send("pomodoro:update", state),
  onToggleRequest: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("pomodoro:toggle-request", listener);
    return () => ipcRenderer.removeListener("pomodoro:toggle-request", listener);
  },
});
