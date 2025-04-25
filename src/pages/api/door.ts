import { createHmac } from "node:crypto"
import type { APIRoute } from "astro"
import { currentEvent } from "@/util/event.ts"

export const POST: APIRoute = async () => {
  const now = Date.now()
  if (now <= currentEvent.startDateTime.getTime() || now >= currentEvent.endDateTime.getTime())
    return new Response("La porte ne peut pas être ouverte avant ou après la LAN", { status: 403 })

  const token = process.env.DOOR_TOKEN
  const secret = process.env.DOOR_SECRET
  const deviceId = process.env.DOOR_DEVICE

  if (!token || !secret)
    return new Response("variables DOOR_TOKEN, DOOR_SECRET and DOOR_DEVICE must be defined", { status: 500 })

  const t = Date.now().toString()
  const nonce = "requestID"
  const data = token + t + nonce
  const signTerm = createHmac("sha256", secret).update(Buffer.from(data, "utf-8")).digest()
  const sign = signTerm.toString("base64")

  const body = JSON.stringify({
    command: "press",
    parameter: "default",
    commandType: "command",
  })

  const res = await fetch(`https://api.switch-bot.com/v1.1/devices/${deviceId}/commands`, {
    method: "POST",
    headers: {
      Authorization: token,
      sign: sign,
      nonce: nonce,
      t: t,
      "Content-Type": "application/json",
    },
    body,
  })

  const json = await res.json()
  return new Response(json, { status: res.status })
}
