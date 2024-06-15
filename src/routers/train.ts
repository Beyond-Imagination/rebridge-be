import express, { Router } from 'express'
import { courseHealthCheck } from '@/controllers/train.course'
import { centerHealthCheck } from '@/controllers/train.center'

const router: Router = express.Router()

router.get('/health-check', (req, res) => {
    res.status(200).send()
})

router.get('/course/health-check', courseHealthCheck)

router.get('/center/health-check', centerHealthCheck)

export default router
