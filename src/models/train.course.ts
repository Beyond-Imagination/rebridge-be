import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import mongoose from 'mongoose'
import { index, prop, Ref, ReturnModelType } from '@typegoose/typegoose'

import { TrainCenterModel } from '@models/models'
import { TrainCenter } from '@models/train.center'
import { ISimpleUserInfo } from '@/types/user'
import { getRecommendList } from '@services/recommend'
import { BadRequest, NotFoundError } from '@/types/errors'

@index({ title: 'text', category: 'text' })
export class TrainCourse extends TimeStamps {
    public _id: mongoose.Types.ObjectId

    @prop({ ref: () => TrainCenter })
    public trainstCSTId: Ref<TrainCenter>

    @prop()
    public ncsCd: string // NCS 직무분류

    @prop()
    public ncsLv: string // NCS 수준

    @prop()
    public ncsApplay: boolean // NCS 적용여부

    @prop()
    public title: string

    @prop()
    public category: string // 훈련유형

    @prop()
    public url: string // HRD-NET 링크

    @prop()
    public telNo: string // 전화번호

    @prop()
    public trainAvgAge: number // 수강생 평균 연령대

    @prop()
    public yardMan: string // 훈련정원

    @prop()
    public courseMan: number // 훈련비

    @prop()
    public realMan: number // 자비 부담액

    @prop()
    public trainGoal: string // 훈련목표

    @prop()
    public trainPreCourse: string // 선수학습

    @prop()
    public trainPreQual: string // 기취득자격

    @prop()
    public trainLimit: string // 훈련 대상자 요건

    @prop()
    public trainTarget: string // 훈련 대상자

    @prop()
    public trainStrength: string // 훈련 과정 장점

    @prop()
    public elEmplRate: number // 훈련기관 취업률

    @prop()
    public trainTime: string // 훈련시간

    @prop()
    public trainStartDate: string // 훈련시작일자 (yyyy-mm-dd)

    @prop()
    public trainEndDate: string // 훈련종료일자 (yyyy-mm-dd)

    public static async findByFilter(this: ReturnModelType<typeof TrainCourse>, filter: string): Promise<TrainCourse[]> {
        let pipeLine: mongoose.PipelineStage[] = [
            { $limit: 5 },
            {
                $lookup: {
                    from: 'traincenters',
                    localField: 'trainstCSTId',
                    foreignField: '_id',
                    as: 'trainCenter',
                },
            },
            { $unwind: '$trainCenter' },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    elEmplRate: 1,
                    trainStartDate: 1,
                    trainEndDate: 1,
                    addr: '$trainCenter.addr',
                },
            },
        ]

        if (filter === '마감') {
            pipeLine = [
                { $match: { trainStartDate: { $gte: new Date().toISOString().split('T')[0] } } },
                { $sort: { trainStartDate: 1 } },
                ...pipeLine,
            ]
        } else if (filter === '취업률') {
            pipeLine = [{ $sort: { elEmplRate: -1 } }, ...pipeLine]
        } else if (filter === '전액지원') {
            pipeLine = [{ $match: { realMan: 0 } }, ...pipeLine]
        } else {
            throw new BadRequest()
        }

        return this.aggregate(pipeLine).exec()
    }

    public static async findByTrainCenterId(
        this: ReturnModelType<typeof TrainCourse>,
        trainCenterId: mongoose.Types.ObjectId,
    ): Promise<TrainCourse[]> {
        return this.aggregate([
            {
                $match: { trainstCSTId: trainCenterId },
            },
            {
                $lookup: {
                    from: 'traincenters',
                    localField: 'trainstCSTId',
                    foreignField: '_id',
                    as: 'trainCenter',
                },
            },
            { $unwind: '$trainCenter' },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    elEmplRate: 1,
                    trainStartDate: 1,
                    trainEndDate: 1,
                    trainTime: 1,
                    addr: '$trainCenter.addr',
                    inoNm: '$trainCenter.inoNm',
                },
            },
        ])
    }

    public static async getDetailsById(this: ReturnModelType<typeof TrainCourse>, id: string): Promise<TrainCourse> {
        const trainCourse = await this.findById(id).exec()
        if (!trainCourse) {
            throw new NotFoundError(`TrainCourse [${id}] does not exist`)
        }
        await trainCourse.populate('trainstCSTId')
        return trainCourse
    }

    public static async getRecommendCourseList(this: ReturnModelType<typeof TrainCourse>, userInfo: ISimpleUserInfo): Promise<TrainCourse[]> {
        const centers = await TrainCenterModel.findNearby(userInfo.addr)
        const data = await this.aggregate([
            {
                $match: { trainstCSTId: { $in: centers } },
            },
            {
                $lookup: {
                    from: 'traincenters',
                    localField: 'trainstCSTId',
                    foreignField: '_id',
                    as: 'trainCenter',
                },
            },
            { $unwind: '$trainCenter' },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    elEmplRate: 1,
                    trainStartDate: 1,
                    trainEndDate: 1,
                    trainTime: 1,
                    addr: '$trainCenter.addr',
                    inoNm: '$trainCenter.inoNm',
                },
            },
        ])
        return await getRecommendList(userInfo, data)
    }
}

interface TrainCourseRawDataType {
    trainCenter: string
    telNo: string
    title: string
    trainStartDate: string
    trainEndDate: string
    trainTime: string
    elEmplRate: number
    courseMan: number
    realMan: number
    category: string
    ncsCd: string
    ncsLv: string
    ncsApply: string
    email: string
    url: string
    trainAvgAge: number
    trainGoal: string
    trainTarget: {
        condition: { prerequisite: string; courseBenefit: string; career: string }
    }
}

export const plainToTrainCourse = (obj: TrainCourseRawDataType): TrainCourse => {
    const trainCourse = new TrainCourse()
    trainCourse.ncsCd = obj.ncsCd
    trainCourse.ncsLv = obj.ncsLv
    trainCourse.ncsApplay = obj.ncsApply === 'Y'
    trainCourse.title = obj.title
    trainCourse.category = obj.category
    trainCourse.url = obj.url
    trainCourse.telNo = obj.telNo

    trainCourse.trainAvgAge = obj.trainAvgAge || -1
    trainCourse.elEmplRate = obj.elEmplRate || -1
    trainCourse.trainTarget = null

    trainCourse.trainStartDate = obj.trainStartDate
    trainCourse.trainEndDate = obj.trainEndDate
    trainCourse.trainPreCourse = obj.trainTarget?.condition?.prerequisite
    trainCourse.trainPreQual = obj.trainTarget?.condition?.career
    trainCourse.trainGoal = obj.trainGoal
    trainCourse.trainStrength = obj.trainTarget?.condition?.courseBenefit
    trainCourse.trainTime = obj.trainTime

    trainCourse.realMan = obj.realMan
    trainCourse.courseMan = obj.courseMan

    return trainCourse
}
