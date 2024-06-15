import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import mongoose from 'mongoose'
import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { TrainCourse } from '@models/train.course'

export class TrainCenter extends TimeStamps {
    public _id: mongoose.Types.ObjectId

    @prop()
    public inoNm: string // 기관명

    @prop()
    public grade: string // 등급

    @prop()
    public zipCd: string // 우편번호

    @prop()
    public addr1: string // 주소지

    @prop()
    public addr2: string // 상세주소

    @prop({ required: true })
    public longitude: number // 경도

    @prop({ required: true })
    public latitude: number // 위도

    @prop()
    public telNo: string // 전화번호

    @prop()
    public faxNo: string // 팩스번호

    @prop()
    public email: string // 이메일

    @prop()
    public hpAddr: string // 홈페이지주소

    @prop({ ref: 'TrainCourse' })
    public trainCourses: Ref<TrainCourse>[]
}

export const TrainCenterModel = getModelForClass(TrainCenter)
