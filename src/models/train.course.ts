import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import mongoose from 'mongoose'
import { prop, Ref } from '@typegoose/typegoose'

export class TrainCourse extends TimeStamps {
    public _id: mongoose.Types.ObjectId

    @prop()
    public trainstCSTId: Ref<any> // TODO: 추후에 TrainCenter 모델 추가되면 수정

    @prop()
    public ncsCd: string // NCS 직무분류

    @prop()
    public ncsLv: number // NCS 수준

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
