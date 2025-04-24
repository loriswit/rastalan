import { execSync } from "node:child_process"
import { networkInterfaces } from "node:os"
import type { Client, LanService } from "@/util/types.ts"

const localAddresses = Object.values(networkInterfaces())
  .flat()
  .map(int => int?.address)

export function getClients(): { all: Client[]; wired: Client[] } {
  if (!process.env.LAN_MODE || !process.env.LAN_CLIENTS_CMD) return { all: [], wired: [] }

  const buffer = execSync(process.env.LAN_CLIENTS_CMD)
  const all: Client[] = Object.values(JSON.parse(buffer.toString()).clients)
  const wired = all.filter(client => client.online && client.iface === "cable" && !localAddresses.includes(client.ip))

  return { all, wired }
}

export const services: LanService[] = JSON.parse(process.env.LAN_SERVICES ?? "[]")
