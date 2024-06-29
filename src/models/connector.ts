import mongoose from 'mongoose'

import { DB_NAME, DB_URI } from '@config'
import { logger } from '@utils/logger'

export default async function () {
    await mongoose.connect(DB_URI, { dbName: DB_NAME })
    logger.info(`successfully connect mongo db. DB_NAME=${DB_NAME}`)
}
