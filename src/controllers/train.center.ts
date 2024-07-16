import { Request, Response } from 'express'
import { TrainCenterModel } from '@models/models'
import { InternalServerError } from '@/types/errors'
export async function centerHealthCheck(req: Request, res: Response) {
    res.status(200).send('OK')
}

export async function centerGetDetails(req: Request, res: Response) {
    const trainCenter = await TrainCenterModel.getDetailsById(req.query.id)
    if (!trainCenter) {
        res.status(404).json({ message: 'Train center not found' })
    }
    res.status(200).json(trainCenter)
}

export async function searchTrainCenter(req: Request, res: Response) {
    const query = req.query.value
    if (!query) {
        throw new Error('Search value is required')
    }

    const result = await TrainCenterModel.find({ inoNm: { $regex: new RegExp(`${query}`, 'i') } })

    if (!result) {
        throw new InternalServerError()
    }
}
