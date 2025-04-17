import type { Event } from "@/util/types.ts"
import { sql } from "@/util/db.ts"

const event = (
  await sql`select *
            from event
            order by start_date desc
            limit 1`
)[0] as Event

export const currentEvent = {
  id: event.id,
  name: event.name,
  number: event.number,
  startDateTime: event.start_date,
  startDate: new Date(event.start_date.toISOString().substring(0, 10)),
  endDateTime: event.end_date,
  endDate: new Date(event.end_date.toISOString().substring(0, 10)),
  days: [] as Date[],
  timezone: process.env.TIMEZONE ?? "Europe/Zurich",
}

const DAY_LENGTH = 24 * 3600 * 1000
const numberOfDays = Math.floor((currentEvent.endDate.getTime() - currentEvent.startDate.getTime()) / DAY_LENGTH) + 1

currentEvent.days = [...Array(numberOfDays)].map(
  (_, index) => new Date(currentEvent.startDate.getTime() + index * DAY_LENGTH),
)
