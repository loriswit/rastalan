import { neon } from "@neondatabase/serverless"
import type { Event } from "@/util/types"

if (!process.env.DATABASE_URL) throw new Error("Error: variable DATABASE_URL is not defined")

export const sql = neon(process.env.DATABASE_URL)

export const currentEvent = (
  await sql`select *
            from event
            order by start_date desc
            limit 1`
)[0] as Event
