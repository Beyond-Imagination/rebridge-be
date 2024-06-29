import express, { Router } from 'express'
import { addUser, healthCheck, signIn, signUp } from '@/controllers/user'

const router: Router = express.Router()

router.get('/health-check', healthCheck)
router.post('/add-user', addUser)
router.post('/signIn', signIn)
router.post('/signUp', signUp)

export default router
