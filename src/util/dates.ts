import { currentEvent } from "@/util/db.ts"

export const startDateTime = currentEvent.start_date
export const startDate = new Date(startDateTime.toISOString().substring(0, 10))
export const endDateTime = currentEvent.end_date
export const endDate = new Date(endDateTime.toISOString().substring(0, 10))

const DAY_LENGTH = 24 * 3600 * 1000
const numberOfDays = (endDate.getTime() - startDate.getTime()) / DAY_LENGTH + 1

export const days: Date[] = []
for (let i = 0; i < numberOfDays; i++) days.push(new Date(startDate.getTime() + i * DAY_LENGTH))
