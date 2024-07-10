import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import mongoose from 'mongoose'
import { getModelForClass, index, prop, Ref } from '@typegoose/typegoose'
import { TrainCenter } from '@models/train.center'

@index({ title: 1, category: 1 })
export class TrainCourse extends TimeStamps {
    public _id: mongoose.Types.ObjectId

    @prop({ ref: 'TrainCenter' })
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
    public courseMan: string // 훈련비

    @prop()
    public realMan: string // 자비 부담액

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
    public elEmplRate: string // 훈련기관 취업률

    @prop()
    public trainTime: string // 훈련시간

    @prop()
    public trainStartDate: string // 훈련시작일자 (yyyy-mm-dd)

    @prop()
    public trainEndDate: string // 훈련종료일자 (yyyy-mm-dd)
}

interface TrainCourseRawDataType {
    trainCenter: string
    telNo: string
    title: string
    trainStartDate: string
    trainEndDate: string
    trainTime: string
    elEmplRate: string
    courseMan: string
    realMan: string
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
    trainCourse.elEmplRate = obj.elEmplRate || '-1'
    trainCourse.trainTarget = null

    trainCourse.trainStartDate = obj.trainStartDate
    trainCourse.trainEndDate = obj.trainEndDate
    trainCourse.trainPreCourse = obj.trainTarget?.condition?.prerequisite
    trainCourse.trainPreQual = obj.trainTarget?.condition?.career
    trainCourse.trainGoal = obj.trainGoal
    trainCourse.trainStrength = obj.trainTarget?.condition?.courseBenefit
    trainCourse.trainTime = obj.trainTime

    return trainCourse
}

export const TrainCourseModel = getModelForClass(TrainCourse)
