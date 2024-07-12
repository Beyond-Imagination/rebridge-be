import { NextFunction, Request, Response } from 'express'

import { APIError, InternalServerError } from '@/types/errors'
import { logger } from '@/utils/logger'

const errorMiddleware = (error: APIError, req: Request, res: Response, next: NextFunction) => {
    try {
        if (!(error instanceof APIError)) {
            error = new InternalServerError(error)
        }
        res.meta.error = error
        res.status(error.statusCode).json({
            message: error.message,
            code: error.errorCode,
        })
    } catch (e) {
        const logged = {
            original: error,
            new: e,
        }
        logger.error('fail in error middleware', JSON.stringify(logged))
        res.status(500).json({ message: 'internal server error', code: 500 })
    }
}

export default errorMiddleware
