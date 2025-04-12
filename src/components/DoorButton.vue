<script setup lang="ts">
import { ref } from "vue"
import "@/assets/styles/spinner.css"

let loading = ref(false)
let success = ref(false)

async function openDoor() {
  loading.value = true
  const res = await fetch("/door", { method: "POST" })
  loading.value = false
  if (res.status >= 400) alert("Erreur : " + (await res.text()))
  else {
    success.value = true
    setTimeout(() => (success.value = false), 3000)
  }
}
</script>

<template>
  <button @click="openDoor" :disabled="loading" v-if="!success">
    <span class="spinner" v-if="loading"></span>
    <span v-else><slot></slot></span>
  </button>
  <button class="success" v-else>✔️ La porte va s'ouvrir&nbsp;!</button>
</template>

<style scoped>
button.success {
  background-color: lightseagreen;
  pointer-events: none;
}
</style>
