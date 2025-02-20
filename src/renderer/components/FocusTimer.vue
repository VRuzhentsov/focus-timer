<script setup lang="ts">
import defaultAlarmSound from '../assets/default-alarm.mp3'
import { ref, computed, onMounted } from 'vue'

const focusDuration = ref(25)
const restDuration = ref(5)
const timeLeft = ref(0)
const isRunning = ref(false)
const isResting = ref(false)
const audioFile = ref('')

const displayTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

onMounted(() => {
  window.electronAPI.onTimerTick(({ timeLeft: newTime, isResting: newIsResting }) => {
    timeLeft.value = newTime;
    isResting.value = newIsResting;
    isRunning.value = true;
  });

  window.electronAPI.onTimerComplete(() => {
    playAlarm();
    isRunning.value = false;
    isResting.value = false;
    timeLeft.value = 0;
  });
});

const startTimer = () => {
  if (isRunning.value) return
  window.electronAPI.startFocus(focusDuration.value);
}

const startRest = () => {
  if (isRunning.value) return
  window.electronAPI.startRest(restDuration.value);
}

const stopTimer = () => {
  window.electronAPI.stopTimer();
  isRunning.value = false;
  isResting.value = false;
  timeLeft.value = 0;
}

const playAlarm = () => {
  try {
    const audio = new Audio(audioFile.value || defaultAlarmSound)
    audio.play().catch(error => {
      console.error('Error playing audio:', error)
    })
  } catch (error) {
    console.error('Error creating Audio instance:', error)
  }
}

const handleAudioFile = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    audioFile.value = URL.createObjectURL(file)
  }
}
</script>

<template>
  <div class="focus-timer">
    <h1>Focus Timer</h1>

    <div class="timer-display">
      {{ displayTime }}
    </div>

    <div class="controls">
      <button @click="startTimer" :disabled="isRunning">Start Focus</button>
      <button @click="startRest" :disabled="isRunning">Start Rest</button>
      <button @click="stopTimer">Stop</button>
    </div>

    <div class="settings">
      <div class="setting-group">
        <label>Focus Duration (minutes):</label>
        <input type="number" v-model="focusDuration" min="1" :disabled="isRunning">
      </div>

      <div class="setting-group">
        <label>Rest Duration (minutes):</label>
        <input type="number" v-model="restDuration" min="1" :disabled="isRunning">
      </div>

      <div class="setting-group">
        <label>Custom Alarm Sound:</label>
        <input type="file" accept=".mp3" @change="handleAudioFile">
      </div>
    </div>
  </div>
</template>

<style scoped>
.focus-timer {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.timer-display {
  font-size: 4rem;
  font-weight: bold;
  margin: 2rem 0;
  font-family: monospace;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.controls button {
  flex: 1;
  padding: 0.5rem;
  font-size: 1.1rem;
}

.settings {
  text-align: left;
}

.setting-group {
  margin: 1rem 0;
}

.setting-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.setting-group input {
  width: 100%;
  padding: 0.5rem;
}
</style>
