import { Request, Response } from 'express'

import { ISimpleUserInfo } from '@/types/user'
import { AdditionalInformationMissingError } from '@/types/errors'
import { TrainCourseModel, UserModel } from '@/models'

export async function courseHealthCheck(req: Request, res: Response) {
    res.status(200).send('OK')
}

export async function recommendCourse(req: Request, res: Response) {
    const user = await UserModel.findByOauthId(req.decode.id)
    if (!user.hasAddtionalInfoProvided()) {
        throw new AdditionalInformationMissingError()
    }
    const userInfo: ISimpleUserInfo = {
        age: user.calcAge(),
        major: user.major,
        prevJob: user.occupation,
        jobObjectives: user.jobObjectives,
        addr: user.address,
    }

    const data = await TrainCourseModel.getRecommendCourseList(userInfo)
    // TODO: 지도 만들고, 데이터에 대한 마커 삽입 후 전달
    res.status(200).json({
        docs: data,
    })
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
