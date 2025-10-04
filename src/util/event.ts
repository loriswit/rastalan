import type { Event, ExtendedEvent } from "@/util/types.ts"
import { sql } from "@/util/db.ts"

const DAY_LENGTH = 24 * 3600 * 1000

export async function loadEvent(eventNumber?: number): Promise<ExtendedEvent | null> {
  let event: Event
  if (eventNumber) {
    event = (
      await sql`select *
                from event
                where number = ${eventNumber}`
    )[0] as Event
  } else {
    // fetch latest event
    event = (
      await sql`select *
                from event
                order by start_date desc
                limit 1`
    )[0] as Event
  }

  if (!event) return null

  const startDate = new Date(event.start_date.toISOString().substring(0, 10))
  const endDate = new Date(event.end_date.toISOString().substring(0, 10))
  const numberOfDays = Math.floor((endDate.getTime() - startDate.getTime()) / DAY_LENGTH) + 1
  const days = [...Array(numberOfDays)].map((_, index) => new Date(startDate.getTime() + index * DAY_LENGTH))

  return {
    id: event.id,
    name: event.name,
    number: event.number,
    startDateTime: event.start_date,
    startDate,
    endDateTime: event.end_date,
    endDate,
    days,
    timezone: process.env.TIMEZONE ?? "Europe/Zurich",
  }
}

export const currentEvent = (await loadEvent()) as ExtendedEvent
