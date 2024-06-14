import express, { Router } from 'express'
import { addUser, healthCheck } from '@/controllers/user'

const router: Router = express.Router()

router.get('/health-check', healthCheck)
router.post('/add-user', addUser)

export default router
