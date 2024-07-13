import express, { Router } from 'express'
import asyncify from 'express-asyncify'
import { courseHealthCheck } from '@/controllers/train.course'
import { centerGetDetails, centerHealthCheck } from '@/controllers/train.center'
import { categorySummary, regionDetail, regionSummary } from '@/controllers/train.statistic'

const router: Router = asyncify(express.Router())

router.get('/health-check', (req, res) => {
    res.status(200).send()
})

router.get('/course/health-check', courseHealthCheck)

/* train center */
router.get('/center/health-check', centerHealthCheck)
router.get('/center', centerGetDetails)
////////////////////////////////

router.get('/statistic/region-summary', regionSummary)

router.get('/statistic/category-summary', categorySummary)

router.get('/statistic/region-detail', regionDetail)

export default router
