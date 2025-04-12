import { defineConfig } from "astro/config"
import { fileURLToPath, URL } from "node:url"

import vue from "@astrojs/vue"

import vercel from "@astrojs/vercel"

export default defineConfig({
  output: "server",

  vite: {
    resolve: {
      alias: {
        "@/assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      },
    },
  },

  integrations: [vue()],
  adapter: vercel(),
})
