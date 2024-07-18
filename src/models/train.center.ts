import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import mongoose from 'mongoose'
import { index, prop, Ref, ReturnModelType } from '@typegoose/typegoose'
import { TrainCourse } from '@models/train.course'
import { getCoordination } from '@/batch/utils'

@index({ inoNm: 'text', telNo: 'text' })
@index({ coordinates: '2dsphere' })
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
    public coordinates: {
        longitude: number // 경도
        latitude: number // 위도
    }

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
        return trainCenter
    }

    public static async findNearby(this: ReturnModelType<typeof TrainCenter>, addr: string): Promise<mongoose.Types.ObjectId[]> {
        const { longitude, latitude } = await getCoordination(addr)
        const data = await this.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [longitude, latitude] },
                    distanceField: 'distance',
                    spherical: true,
                    maxDistance: 5000, // 미터 단위
                },
            },
            {
                $project: {
                    _id: 1,
                },
            },
        ])
        return data.map(d => d._id)
    }

    public static async getNearByCenter(this: ReturnModelType<typeof TrainCenter>, options: any): Promise<TrainCenter[]> {
        const { latitude, longitude, size } = options
        return await this.aggregate([
            {
                $geoNear: {
                    spherical: true,
                    near: {
                        type: 'Point',
                        coordinates: [Number(longitude), Number(latitude)],
                    },
                    distanceField: 'distance',
                },
            },
            {
                $limit: Number(size),
            },
            {
                $lookup: {
                    from: 'traincourses',
                    localField: 'trainCourses',
                    foreignField: '_id',
                    as: 'trainCourses',
                },
            },
        ]).exec()
    }
}

export async function plainToTrainCenter(obj: any): Promise<TrainCenter> {
    const trainCenter = new TrainCenter()
    trainCenter.inoNm = obj.inoNm
    trainCenter.zipCd = obj.zipCd
    trainCenter.addr = obj.addr
    trainCenter.coordinates = await getCoordination(obj.addr)
    trainCenter.grade = obj.grade
    trainCenter.telNo = obj.telNo
    trainCenter.faxNo = obj.faxNo
    trainCenter.email = obj.email
    trainCenter.hpAddr = obj.hpAddr
    return trainCenter
}
