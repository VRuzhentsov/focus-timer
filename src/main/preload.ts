import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (message: string) => ipcRenderer.send("message", message),
  startFocus: (duration: number) => ipcRenderer.send("start-focus", duration),
  startRest: (duration: number) => ipcRenderer.send("start-rest", duration),
  stopTimer: () => ipcRenderer.send("stop-timer"),
  onTimerTick: (
    callback: (data: { timeLeft: number; isResting: boolean }) => void
  ) => ipcRenderer.on("timer-tick", (_, data) => callback(data)),
  onTimerComplete: (callback: () => void) =>
    ipcRenderer.on("timer-complete", () => callback()),
});
