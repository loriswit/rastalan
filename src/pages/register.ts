import type { APIRoute } from "astro"
import { currentEvent, sql } from "@/util/db.ts"

export const PUT: APIRoute = async ({ request }) => {
  const { name, hardware, days, conditionsRead, conditionsAccepted } = await request.json()

  try {
    const registration = (await sql`select exists(select 1 from registration where name = ${name})`)[0]
    if (registration.exists) {
      await sql`update registration
                set hardware            = ${JSON.stringify(hardware)},
                    days                = ${JSON.stringify(days)},
                    conditions_read     = ${conditionsRead},
                    conditions_accepted = ${conditionsAccepted}
                where name = ${name}`
      return new Response(null, { status: 204 })
    } else {
      await sql`insert into registration (name, hardware, days, conditions_read, conditions_accepted, event_id)
                values (${name}, ${JSON.stringify(hardware)}, ${JSON.stringify(days)},
                        ${conditionsRead}, ${conditionsAccepted}, ${currentEvent.id})`
      return new Response(null, { status: 201 })
    }
  } catch (err: any) {
    console.warn(err)
    return new Response(err.message, { status: 400 })
  }
}
