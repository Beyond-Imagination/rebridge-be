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

        // TrainCenter와 TrainCourse와의 연관관계를 매핑합니다.
        coursePlainObjects = extractModelFromJson(courseFileString, COMPATIBLE_DATA_TYPES.COURSE, [])
        // trainCourse => trainCenter로의 매핑
        const bulkSaveCourseModels: TrainCourse[] = []
        for (const obj of coursePlainObjects) {
            // obj에서 {title, category} 를 통해서 model id를 가져온 다음 해당 모델을 업데이트
            const model: TrainCourse = await TrainCourseModel.findOne({ title: obj.title, category: obj.category }).exec()
            if (!model) {
                throw new Error('Model not found')
            }

            const idx = obj.trainCenter - 1
            if (idx < 0) {
                throw new Error('idx must be greater than 0')
            }
            // centerPlainObjects에서 center Model을 가져오기 위한 정보를 가져온다
            const { inoNm, telNo } = centerPlainObjects[idx]
            const target: TrainCenter = await TrainCenterModel.findOne({ inoNm: inoNm, telNo: telNo }).exec()
            if (!target) {
                throw new Error('update target not found')
            }

            model.trainstCSTId = target._id
            bulkSaveCourseModels.push(model)
        }

        console.log(`course -> center mapping 완료`)

        centerPlainObjects = extractModelFromJson(centerFileString, COMPATIBLE_DATA_TYPES.CENTER, [])
        const bulkSaveCenterModels: TrainCenter[] = []
        for (const obj of centerPlainObjects) {
            const model: TrainCenter = await TrainCenterModel.findOne({ inoNm: obj.inoNm, telNo: obj.telNo }).exec()
            if (!model) {
                throw new Error('Model not found')
            }

            const idxs: number[] = obj.trainCourses
            if (idxs.length === 0) {
                throw new Error('idxs must not be empty')
            }

            const updatedValue = []
            for (const idx of idxs) {
                if (idx < 0) {
                    throw new Error('idx must be greater than 0')
                }
                const { telNo, title } = coursePlainObjects[idx]
                const target: TrainCourse = await TrainCourseModel.findOne({ telNo: telNo, title: title }).exec()
                if (!target) {
                    throw new Error('update target not found')
                }
                updatedValue.push(target._id)
            }
            model.trainCourses = updatedValue
            bulkSaveCenterModels.push(model)
        }

        console.log(`center -> <multiple> course mapping 완료`)
        await TrainCourseModel.bulkWrite(
            bulkSaveCourseModels.map(doc => ({
                updateOne: {
                    filter: { _id: doc._id },
                    update: { $set: { trainstCSTId: doc.trainstCSTId } },
                },
            })),
        )

        await TrainCenterModel.bulkWrite(
            bulkSaveCenterModels.map(doc => ({
                updateOne: {
                    filter: { _id: doc._id },
                    update: { $set: { trainCourses: doc.trainCourses } },
                },
            })),
        )

        console.log('데이터베이스 갱신 성공')
    } catch (err) {
        console.error('실패', err)
    } finally {
        mongoose.disconnect()
    }
}

async function start() {
    await renewDatabase()
    process.exit(0)
}

start()
