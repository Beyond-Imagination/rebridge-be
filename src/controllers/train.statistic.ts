import { Request, Response } from 'express'
import { StatisticModel } from '@models/train.statistic'

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
