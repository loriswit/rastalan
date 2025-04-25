<script setup lang="ts">
import { ref } from "vue"
import type { Client } from "@/util/types.ts"

const { clients } = defineProps<{ clients: { all: Client[]; wired: Client[] } }>()

const wiredClients = ref(clients.wired)

async function updateClients() {
  const res = await fetch("/api/clients")
  wiredClients.value = (await res.json()).wired
}

setInterval(updateClients, 10000)
</script>

<template>
  <div class="clients" v-if="clients">
    <div class="client" v-for="client of wiredClients">
      <span>{{ client.name }}</span>
      <span>
        <code>{{ client.ip }}</code>
      </span>
    </div>
  </div>
</template>

<style scoped>
.clients {
  margin: 1em 0;
}

.client {
  display: flex;
  justify-content: space-between;
  gap: 2em;
  padding: 0.3em 0;
}
</style>
