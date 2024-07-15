import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import mongoose from 'mongoose'
import { index, prop, Ref, ReturnModelType } from '@typegoose/typegoose'
import { TrainCourse } from '@models/train.course'
import { getCoordination } from '@/batch/utils'

@index({ inoNm: 'text', telNo: 'text' })
export class TrainCenter extends TimeStamps {
    public _id: mongoose.Types.ObjectId

    @prop()
    public inoNm: string // 기관명

    @prop()
    public grade: string // 등급

    @prop()
    public zipCd: string // 우편번호

    @prop()
    public addr: string // 주소지

    @prop()
    public longitude: number // 경도

    @prop()
    public latitude: number // 위도

    @prop()
    public telNo: string // 전화번호

    @prop()
    public faxNo: string // 팩스번호

    @prop()
    public email: string // 이메일

    @prop()
    public hpAddr: string // 홈페이지주소

    @prop({ ref: () => TrainCourse })
    public trainCourses: Ref<TrainCourse>[]

    public static async getDetailsById(this: ReturnModelType<typeof TrainCenter>, id: string): Promise<TrainCenter> {
        const trainCenter = await this.findOne({ _id: id }).exec()
        if (!trainCenter) {
            throw new Error('TrainCenter not found')
        }
        if (trainCenter.trainCourses?.length > 0) {
            await trainCenter.populate('trainCourses')
        }
        return trainCenter
    }
}

export async function plainToTrainCenter(obj: any): Promise<TrainCenter> {
    const trainCenter = new TrainCenter()
    trainCenter.inoNm = obj.inoNm
    trainCenter.zipCd = obj.zipCd
    trainCenter.addr = obj.addr
    const coordinates = await getCoordination(obj.addr)
    trainCenter.longitude = coordinates.longitude
    trainCenter.latitude = coordinates.latitude
    trainCenter.grade = obj.grade
    trainCenter.telNo = obj.telNo
    trainCenter.faxNo = obj.faxNo
    trainCenter.email = obj.email
    trainCenter.hpAddr = obj.hpAddr
    return trainCenter
}
