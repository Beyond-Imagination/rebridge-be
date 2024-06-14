import * as mongoose from 'mongoose'
import { DB_NAME, DB_URI } from '@config'

export default async function () {
    await mongoose.connect(DB_URI, { dbName: DB_NAME })
}
