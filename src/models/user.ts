import { getModelForClass, mongoose, prop, ReturnModelType } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'

import { SignInFailedError } from '@/types/errors'

export class Users extends TimeStamps {
    public _id: mongoose.Types.ObjectId

    @prop({ required: true, default: 'rebridge' })
    public oauthProvider: string

    @prop({ unique: true })
    public oauthId: string

    @prop({ required: true })
    public passwd: string

    @prop()
    public email: string

    @prop()
    public name: string

    @prop()
    public birthDate: Date

    @prop()
    public gender: number // 0: male, 1: female

    @prop()
    public occupation: string // 사용자 현재 직업

    // 추가 입력 정보
    @prop()
    public major: string // 전공

    @prop()
    public jobObjectives: string // 희망 직종

    @prop()
    public address: string // 거주지

    public static async findById(this: ReturnModelType<typeof Users>, id: string): Promise<Users> {
        return await this.findOne({ _id: id }).exec()
    }

    public static async findByOauthId(this: ReturnModelType<typeof Users>, oauthId: string): Promise<Users> {
        return await this.findOne({ oauthId: oauthId }).exec()
    }

    public static async signIn(this: ReturnModelType<typeof Users>, oauthId: string, password: string): Promise<string> {
        const user = await this.findByOauthId(oauthId)
        if (!user) {
            throw new SignInFailedError()
        }
        const match = await bcrypt.compare(password, user.passwd)
        if (!match) {
            throw new SignInFailedError()
        }
        // TODO: change secret key
        return jwt.sign({ id: user.oauthId, provider: user.oauthProvider }, 'secret-수정필요', {
            expiresIn: '1h',
            jwtid: v4(),
        })
    }

    public calcAge(): number {
        const today = new Date()
        const age = today.getFullYear() - this.birthDate.getFullYear()
        const monthDiff = today.getMonth() - this.birthDate.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate.getDate())) {
            return age - 1
        }
        return age
    }

    public hasAddtionalInfoProvided(): boolean {
        return !!this.major || !!this.jobObjectives || !!this.address
    }
}

export const UserModel = getModelForClass(Users)
