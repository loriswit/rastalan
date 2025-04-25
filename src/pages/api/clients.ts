import type { APIRoute } from "astro"
import { getClients } from "@/util/lan.ts"

export const GET: APIRoute = async () => {
  if (!process.env.LAN_MODE) return new Response(null, { status: 404 })

  const clients = getClients()
  return new Response(JSON.stringify(clients), { headers: { "Content-Type": "application/json" } })
}
