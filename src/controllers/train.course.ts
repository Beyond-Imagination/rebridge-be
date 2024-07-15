import { Request, Response } from 'express'
import { TrainCourseModel } from '@models/models'

export async function courseHealthCheck(req: Request, res: Response) {
    res.status(200).send('OK')
}

export async function getTrainCourseList(req: Request, res: Response) {
    const result = await TrainCourseModel.findByFilter(req.query.filter as string)
    res.status(200).json({
        docs: result,
        docsNm: result.length,
    })
}

export async function courseGetDetails(req: Request, res: Response) {
    const trainCourse = await TrainCourseModel.getDetailsById(req.query.id)
    res.status(200).json(trainCourse)
}
