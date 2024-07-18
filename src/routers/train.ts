import express, { Router } from 'express'
import asyncify from 'express-asyncify'

import { verifyToken } from '@/middleware/verifyUser'
import {
    categorySummary,
    centerGetDetails,
    centerHealthCheck,
    courseGetDetails,
    courseHealthCheck,
    getNCSInfo,
    getNearbyCenter,
    getTrainCourseList,
    recommendCourse,
    regionDetail,
    regionSummary,
    searchTrainCenter,
} from '@controllers'

const router: Router = asyncify(express.Router())

router.get('/health-check', (req, res) => {
    res.status(200).send()
})

/* train course */
router.get('/course/health-check', courseHealthCheck)
router.get('/course/simpleList', getTrainCourseList)
router.get('/course/recommend', verifyToken, recommendCourse)
router.get('/course', courseGetDetails)
////////////////////////////////

/* train center */
router.get('/center/health-check', centerHealthCheck)
router.get('/center', centerGetDetails)
router.get('/center/nearby', getNearbyCenter)
router.get('/center/search', searchTrainCenter)
////////////////////////////////

router.get('/statistic/region-summary', regionSummary)

router.get('/statistic/category-summary', categorySummary)

router.get('/statistic/region-detail', regionDetail)

router.get('/statistic/ncsCd', getNCSInfo)

export default router
