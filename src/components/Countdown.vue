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

setInterval(() => --secondsLeft.value, 1000)

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
  return `${days}:${hours}:${min}:${sec}`
})
</script>

<template>
  <span class="countdown">{{ countdown }}</span>
</template>
