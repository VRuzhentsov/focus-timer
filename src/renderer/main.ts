declare global {
  interface Window {
    electronAPI: {
      sendMessage: (message: string) => void;
      startFocus: (duration: number) => void;
      startRest: (duration: number) => void;
      stopTimer: () => void;
      onTimerTick: (
        callback: (data: { timeLeft: number; isResting: boolean }) => void
      ) => void;
      onTimerComplete: (callback: () => void) => void;
    };
  }
}

import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);

app.mount("#app");
