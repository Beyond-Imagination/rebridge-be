import { Request, Response } from 'express'

import { TrainCenterModel, TrainCourseModel } from '@/models'
import { NotFoundError } from '@/types/errors'

export async function centerHealthCheck(req: Request, res: Response) {
    res.status(200).send('OK')
}

export async function centerGetDetails(req: Request, res: Response) {
    const trainCenter = await TrainCenterModel.getDetailsById(req.query.id)
    const trainCourses = await TrainCourseModel.findByTrainCenterId(trainCenter._id)

    res.status(200).json({ trainCenter: trainCenter, trainCourses: trainCourses })
}

export async function getNearbyCenter(req: Request, res: Response) {
    const size = req.query.size
    const { latitude, longitude } = req.headers
    const result = await TrainCenterModel.getNearByCenter({ latitude, longitude, size })
    res.status(200).json(result)
}

export async function searchTrainCenter(req: Request, res: Response) {
    const query = req.query.value
    if (!query) {
        throw new Error('Search value is required')
    }

    const result = await TrainCenterModel.find({ inoNm: { $regex: new RegExp(`${query}`, 'i') } })
    if (!result || result.length === 0) {
        throw new NotFoundError('search result is none')
    }

    res.status(200).json(result)
}
