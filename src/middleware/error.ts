import { APIError } from '@/types/errors/error'
import { Request, Response } from 'express'

const errorMiddleware = (error: APIError, req: Request, res: Response) => {
    try {
        res.error = error
        res.status(eror.statusCode).json(error.toJSON())
    } catch (e) {
        // TODO: add logger
        const logged = {
            original: error,
            new: e,
        }
        console.error('fail in error middleware' + JSON.stringify(logged))
        res.status(500).json({ message: 'internal server error' })
    }
}

export default errorMiddleware
