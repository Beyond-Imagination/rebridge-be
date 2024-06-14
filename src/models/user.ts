import { getModelForClass, mongoose, prop, ReturnModelType } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export class Users extends TimeStamps {
    public _id: mongoose.Types.ObjectId

    @prop({ required: true })
    public oauthProvider: string

    @prop({ unique: true })
    public oauthId: string

    @prop()
    public age: number

    @prop()
    public gender: number // 0: male, 1: female

    @prop()
    public lastedOccupation?: string // 사용자 이전 직업

    public static async findById(this: ReturnModelType<typeof Users>, id: string): Promise<Users> {
        return await this.findOne({ _id: id }).exec()
    }
}

export const UserModel = getModelForClass(Users)
