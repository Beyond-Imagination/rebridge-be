import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { UserModel } from '@models/user'
import { logger } from '@utils/logger'
import { SignUpFailError } from '@/types/errors/user'

export async function healthCheck(req: Request, res: Response) {
    res.status(200).send('OK')
}

// TODO: remove this function
export async function addUser(req: Request, res: Response) {
    try {
        const data = {
            oauthProvider: 'oauthProvider',
            oauthId: uuidv4(),
            age: 10,
            gender: 0,
            lastedOccupation: 'lastedOccupation',
        }
        await UserModel.create(data)
    } catch (e) {
        logger.error(`error: ${JSON.stringify(e)}`)
    }

    res.status(202).send('User added successfully!')
}

export async function signIn(req: Request, res: Response) {
    // TODO: add oauth 2.0 login
    const token = await UserModel.signIn(req.body.oauthId, req.body.password)
    res.status(200).send({ jwt: token })
}

export async function signUp(req: Request, res: Response) {
    const hashPasswd = await bcrypt.hash(req.body.password, 10)
    const user = await UserModel.create({
        oauthProvider: req.body.oauthProvider,
        oauthId: req.body.oauthId,
        name: req.body.name,
        passwd: hashPasswd,
        email: req.body.email,
        birthDate: new Date(req.body.birthDate),
        gender: req.body.gender,
        occupation: req.body.occupation,
    })
    if (user) {
        res.status(200).send({ oauthId: user.oauthId })
    } else {
        throw new SignUpFailError()
    }
}
