import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) throw new Error("Error: variable DATABASE_URL is not defined")

export const sql = neon(process.env.DATABASE_URL)
