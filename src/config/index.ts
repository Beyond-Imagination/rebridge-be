import { config } from 'dotenv'

config({ path: `.env` })

export const { DB_URI, DB_NAME, NCS_API_URL, NCS_API_KEY, HUGGING_FACE_API_KEY } = process.env
