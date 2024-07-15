import { Request, Response } from 'express'
import { TrainCenterModel } from '@models/models'
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
