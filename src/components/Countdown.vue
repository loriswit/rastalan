<script setup lang="ts">
import { computed, onMounted, ref } from "vue"

const { date } = defineProps<{ date: Date }>()

let secondsLeft = ref(0)

function updateSecondsLeft() {
  secondsLeft.value = (date.getTime() - Date.now()) / 1000
}

onMounted(() => {
  updateSecondsLeft()
  window.onfocus = updateSecondsLeft
})

setInterval(() => {
  if (secondsLeft.value > 0) {
    --secondsLeft.value
  }
  if (secondsLeft.value <= 0) {
    secondsLeft.value = 0
    location.reload()
  }
}, 1000)

const countdown = computed(() => {
  const days = Math.floor(secondsLeft.value / 3600 / 24)
  const hours = Math.floor((secondsLeft.value / 3600) % 24)
    .toString()
    .padStart(2, "0")
  const min = Math.floor((secondsLeft.value / 60) % 60)
    .toString()
    .padStart(2, "0")
  const sec = Math.floor(secondsLeft.value % 60)
    .toString()
    .padStart(2, "0")

  return { days, hours, min, sec }
})
</script>

<template>
  <div class="countdown">
    <div>
      <span class="value">{{ countdown.days }}</span>
      <span class="label">jours</span>
    </div>
    <div>
      <span class="value">{{ countdown.hours }}</span>
      <span class="label">heures</span>
    </div>
    <div>
      <span class="value">{{ countdown.min }}</span>
      <span class="label">min</span>
    </div>
    <div>
      <span class="value">{{ countdown.sec }}</span>
      <span class="label">sec</span>
    </div>
  </div>
</template>

<style scoped>
.countdown {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1rem;

  > * {
    transform: skew(-10deg);
    display: flex;
    flex-direction: column;
    background-color: #4004;
    border-radius: 0.2em;
    padding: 0.2em 0.4em;

    .label {
      font-size: 0.3em;
      opacity: 75%;
      text-transform: uppercase;
    }

    &:nth-child(1) {
      --delay: 0.7s;
    }

    &:nth-child(2) {
      --delay: 0.8s;
    }

    &:nth-child(3) {
      --delay: 0.9s;
    }

    &:nth-child(4) {
      --delay: 1s;
    }
  }
}

.animated .countdown > * {
  animation: 1.2s var(--delay) cubic-bezier(0.32, 1.01, 0.26, 1.17) both slide-up;
}

@keyframes slide-up {
  from {
    translate: 0 100px;
    opacity: 0;
  }

  to {
    translate: 0 0;
    opacity: 100%;
  }
}
</style>
