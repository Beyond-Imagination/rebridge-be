import mongoose from 'mongoose'
import { getModelForClass, prop } from '@typegoose/typegoose'
import fs from 'fs'
import path from 'path'

export class TrainStatistic {
    public _id: mongoose.Types.ObjectId

    @prop()
    public region: string

    @prop()
    public category: string

    @prop()
    public year: number

    @prop()
    public trainCenterNm: number

    @prop()
    public trainCourseNm: number

    @prop()
    public trainCourseRoundNm: number

    public toJSON(): object {
        return {
            region: this.region,
            category: this.category,
            year: this.year,
            trainCenterNm: this.trainCenterNm,
            trainCourseNm: this.trainCourseNm,
            trainCourseRoundNm: this.trainCourseRoundNm,
        }
    }
}

export const StatisticModel = getModelForClass(TrainStatistic)

/*
 * 새로운 데이터를 삽입하기 위해서 삽입할 파일을 src/models/에 넣은 후 server.ts에 해당 함수를 실행시킵니다.
 * */
export async function insertData() {
    console.log('start insertData')
    const filePath = path.join(__dirname, 'trainStatistic.json')
    console.log(`check file path:${filePath}`)
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    await StatisticModel.insertMany(data)
    console.log('success insertData')
}
