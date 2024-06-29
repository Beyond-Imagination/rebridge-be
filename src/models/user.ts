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
    public occupation: string // 사용자 이전 직업

    public static async findById(this: ReturnModelType<typeof Users>, id: string): Promise<Users> {
        return await this.findOne({ _id: id }).exec()
    }

    public static async findByOauthId(this: ReturnModelType<typeof Users>, oauthId: string): Promise<Users> {
        return await this.findOne({ oauthId: oauthId }).exec()
    }

    public static async signIn(this: ReturnModelType<typeof Users>, oauthId: string, password: string): Promise<string> {
        const user = await this.findByOauthId(oauthId)
        const match = bcrypt.compare(password, user.passwd)
        if (match) {
            // TODO: change secret key
            return jwt.sign({ id: user.oauthId, provider: user.oauthProvider }, 'secret-수정필요', {
                expiresIn: '1h',
                jwtid: v4(),
            })
        } else {
            throw new SignInFailedError()
        }
    }
}

export const UserModel = getModelForClass(Users)
