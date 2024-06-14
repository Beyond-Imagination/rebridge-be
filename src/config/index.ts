import { config } from 'dotenv'

config({ path: `.env` })

export const { DB_URI, DB_NAME } = process.env
