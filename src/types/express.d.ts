import TokenPayLoad from '@/types/TokenPayLoad'

declare global {
    namespace Express {
        interface Request {
            _routeWhitelists: { body: string[] }
            _routeBlacklists: { body: string[] }
            decode: TokenPayLoad
        }

        interface Response {
            meta: {
                requestId: string
                path?: string
                method?: string
                error?: Error
            }
        }
    }
}
