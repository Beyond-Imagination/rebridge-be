import { Request, Response } from 'express'
import { UserModel } from '@models/user'
import { logger } from '@utils/logger'
import { v4 as uuidv4 } from 'uuid'

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
