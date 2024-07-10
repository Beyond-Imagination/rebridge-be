import TokenPayLoad from '@/types/TokenPayLoad'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    try {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('토큰이 존재하지 않습니다.')
        }
        const token = authHeader.split(' ')[1]
        // TODO: change secret key
        jwt.verify(token, 'secret-수정필요', function (err: Error, decode: TokenPayLoad) {
            if (err) {
                console.log(err)
                throw new Error('잘못된 토큰입니다.')
            }
            req.decode = decode
            next()
        })
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

export { verifyToken }
