// !WARNING!: 이 파일을 수정하지 마세요.
import 'reflect-metadata'
import { plainToTrainCenter, TrainCenter, TrainCenterModel } from '@models/train.center'
import { plainToTrainCourse, TrainCourse, TrainCourseModel } from '@models/train.course'
import * as readline from 'readline'
import { COMPATIBLE_DATA_TYPES, extractModelFromJson } from '@/batch/utils'
import * as fs from 'fs'
import mongoose from 'mongoose'
import { DB_NAME, DB_URI } from '@config'

function askQuestion(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    return new Promise<string>(resolve => {
        rl.question(question, answer => {
            rl.close()
            resolve(answer)
        })
    })
}

async function clearDatabase() {
    await mongoose.connect(DB_URI, { dbName: DB_NAME })
    await TrainCenterModel.deleteMany({})
    await TrainCourseModel.deleteMany({})
}

async function renewDatabase() {
    // 수동으로, trainCourse와 trainCenter의 데이터베이스를 초기화합니다.
    const ans = await askQuestion('데이터베이스를 초기화하시겠습니까? (y/n): ')
    if (ans === 'y') {
        console.log('데이터베이스를 초기화합니다.')
        await clearDatabase()
        console.log('데이터베이스 초기화 성공')
    } else {
        console.log('취소합니다.')
        process.exit(1)
    }

    try {
        // 문자열 형태로 파일 read
        const centerFileString = fs.readFileSync('src/batch/data/json/trainCenter.json', 'utf-8')
        const courseFileString = fs.readFileSync('src/batch/data/json/trainCourse.json', 'utf-8')

        let centerPlainObjects: any[] = extractModelFromJson(centerFileString, COMPATIBLE_DATA_TYPES.CENTER, ['trainCourses'])
        const centerModels: TrainCenter[] = await Promise.all(centerPlainObjects.map(obj => plainToTrainCenter(obj)))

        let coursePlainObjects: any[] = extractModelFromJson(courseFileString, COMPATIBLE_DATA_TYPES.COURSE, ['trainCenter'])
        const courseModels: TrainCourse[] = coursePlainObjects.map(obj => plainToTrainCourse(obj))

        await TrainCenterModel.insertMany(centerModels)
        await TrainCourseModel.insertMany(courseModels)

        await buildRelation(centerFileString, courseFileString)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

async function buildRelation(centerFileString: string, courseFileString: string) {
    const trainCoursePlainObjects = extractModelFromJson(courseFileString, COMPATIBLE_DATA_TYPES.COURSE, [])
    const trainCenterPlainObjects = extractModelFromJson(centerFileString, COMPATIBLE_DATA_TYPES.CENTER, [])

    // course -> center
    const promises1 = trainCoursePlainObjects.map(async course => {
        const targetIndex = course.trainCenter as Number
        const { inoNm, telNo } = trainCenterPlainObjects[targetIndex - 1]
        const targetCenter = await TrainCenterModel.findOne({ inoNm: inoNm, telNo: telNo }).exec()
        if (!targetCenter) {
            throw new Error('No matching center')
        }
        const updatedCourse = await TrainCourseModel.findOne({ title: course.title, category: course.category }).exec()
        if (!updatedCourse) {
            throw new Error('No matching course')
        }
        updatedCourse.trainstCSTId = targetCenter._id
        return await updatedCourse.save()
    })

    // center -> course
    const promises2 = trainCenterPlainObjects.map(async center => {
        const targetIndexes = center.trainCourses as Number[]
        targetIndexes.map(async idx => {
            const { title, category } = trainCoursePlainObjects[idx - 1]
            const targetCourse = await TrainCourseModel.findOne({ title: title, category: category }).exec()
            if (!targetCourse) {
                throw new Error('No matching course')
            }

            const updatedCenter = await TrainCenterModel.findOne({ inoNm: center.inoNm, telNo: center.telNo }).exec()
            if (!updatedCenter) {
                throw new Error('No matching center')
            }
            updatedCenter.trainCourses.push(targetCourse._id)
            return await updatedCenter.save()
        })
    })

    const promises = promises1.concat(promises2)
    await Promise.all(promises)
}

async function start() {
    await renewDatabase()
    process.exit(0)
}

start()
