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
  <h1>{{ wiredClients.length }} joueurs connectés</h1>

  <div class="clients" v-if="clients">
    <div class="client" v-for="client of wiredClients">
      <div class="name">
        <span>{{ client.name }}</span>
        <span class="real-name" v-if="client.realName"> ({{ client.realName }})</span>
      </div>
      <div>
        <code>{{ client.ip }}</code>
      </div>
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

  .name {
    text-align: left;
    white-space: nowrap;
  }

  .real-name {
    font-weight: normal;
    opacity: 50%;
  }
}

@media (max-width: 400px) {
  .client {
    gap: unset;
  }
}
</style>
