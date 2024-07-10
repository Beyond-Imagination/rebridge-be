import TokenPayLoad from '@/types/TokenPayLoad'

declare global {
    namespace Express {
        interface Request {
            decode: TokenPayLoad
        }
    }
}
