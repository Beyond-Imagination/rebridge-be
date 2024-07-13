import { Request, Response } from 'express'

import { StatisticModel } from '@models/train.statistic'
import { getNCSDetail } from '@services/ncs'
import { INCSDetailItem } from '@/types/ncs'

export async function regionSummary(req: Request, res: Response) {
    const year = parseInt(req.query.year as string)
    const summary = await StatisticModel.getSummaryByRegion(year)
    res.status(200).json({
        docs: summary,
        totalDocs: summary.length,
    })
}

export async function categorySummary(req: Request, res: Response) {
    const year = parseInt(req.query.year as string)
    const summary = await StatisticModel.getSummaryByCategory(year)
    res.status(200).json({
        docs: summary,
        totalDocs: summary.length,
    })
}

export async function regionDetail(req: Request, res: Response) {
    const region = String(req.query.region)
    const year = parseInt(req.query.year as string)
    const summary = await StatisticModel.getDetailByRegion(region, year)
    res.status(200).json({
        docs: summary,
        totalDocs: summary.length,
    })
}

export async function getNCSInfo(req: Request, res: Response) {
    const data = await getNCSDetail(req.query.target as string)
    const item: INCSDetailItem = data.body.items.item[0]
    if (!item) {
        throw new Error('NCS API result error')
    }
    res.status(200).json({
        ncsCdNm: item.NCS_SUBD_CDNM,
        ncsInfo: item.DUTY_DEF,
    })
}
