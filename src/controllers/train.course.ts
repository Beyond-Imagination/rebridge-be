import { Request, Response } from 'express'
import { TrainCourseModel } from '@models/train.course'

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
