import express, { Router } from 'express'
import asyncify from 'express-asyncify'
import { addUser, checkToken, healthCheck, signIn, signUp } from '@/controllers/user'
import { verifyToken } from '@/middleware/verifyUser'

const router: Router = asyncify(express.Router())

router.get('/health-check', healthCheck)
router.post('/add-user', addUser)
router.post('/signIn', signIn)
router.post('/signUp', signUp)

router.get('/check-jwt', verifyToken, checkToken)

export default router
