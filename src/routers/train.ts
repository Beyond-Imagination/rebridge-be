import express, { Router } from 'express'

const router: Router = express.Router()

router.get('/health-check', (req, res) => {
    res.status(200).send()
})

export default router
