import type { APIRoute } from "astro"
import { NeonDbError } from "@neondatabase/serverless"
import { z, ZodError } from "zod"
import { currentEvent } from "@/util/event.ts"
import { sql } from "@/util/db.ts"
import { isMailingAvailable, sendMail } from "@/util/mail.ts"

const registrationSchema = z.object({
  name: z.string().min(1),
  hardware: z
    .object({
      pc: z.boolean(),
      laptop: z.boolean(),
      console: z.boolean(),
    })
    .refine(hw => Object.values(hw).includes(true), "Must contain at least one 'true' value"),
  days: z
    .boolean()
    .array()
    .length(currentEvent.days.length)
    .refine(days => days.includes(true), "Must contain at least one 'true' value"),
  conditionsRead: z.boolean(),
  conditionsAccepted: z.boolean(),
})

export const PUT: APIRoute = async ({ request }) => {
  if (currentEvent.endDateTime.getTime() < Date.now()) {
    return new Response("The event is over", { status: 400 })
  }

  try {
    const payload = await request.json()
    const { name, hardware, days, conditionsRead, conditionsAccepted } = registrationSchema.parse(payload)

    const registration = (
      await sql`select exists(select 1
                              from registration
                              where name = ${name}
                                and event_id = ${currentEvent.id})`
    )[0]

    let response: Response
    if (registration.exists) {
      await sql`update registration
                set hardware            = ${JSON.stringify(hardware)},
                    days                = ${JSON.stringify(days)},
                    conditions_read     = ${conditionsRead},
                    conditions_accepted = ${conditionsAccepted}
                where name = ${name}`
      response = new Response(null, { status: 204 })
    } else {
      await sql`insert into registration (name, hardware, days, conditions_read, conditions_accepted, event_id)
                values (${name}, ${JSON.stringify(hardware)}, ${JSON.stringify(days)},
                        ${conditionsRead}, ${conditionsAccepted}, ${currentEvent.id})`
      response = new Response(null, { status: 201 })
    }

    // send email notification
    if (isMailingAvailable()) {
      const hardwareStr = Object.entries(hardware)
        .filter(([_, val]) => val)
        .map(([key]) => key)
        .join(", ")

      const daysStr = currentEvent.days
        .filter((_, index) => days[index])
        .map(day => day.toLocaleDateString("fr-CH", { weekday: "long", day: "numeric" }))
        .join(", ")

      const conditionsStr = conditionsAccepted ? "oui" : "non"

      await sendMail(
        `${name} ${registration.exists ? "a modifié son inscription" : "s'est inscrit"} à la RastaLAN !`,
        `Nom : ${name}\nMatériel : ${hardwareStr}\nJours : ${daysStr}\nConditions acceptées : ${conditionsStr}`,
      )
    }

    return response
  } catch (error) {
    if (error instanceof SyntaxError) return new Response("Body must be valid JSON", { status: 400 })
    else if (error instanceof ZodError)
      return new Response(
        "Payload validation failed:\n" +
          error.issues.map(issue => `- ${issue.path.join(".")}: ${issue.message}`).join("\n"),
        { status: 422 },
      )
    else if (error instanceof NeonDbError) return new Response(error.message, { status: 400 })
    else return new Response(error as any, { status: 500 })
  }
}
