import { APIError } from '@/types/errors/error'

export class NotFoundError extends APIError {
    constructor(message: string) {
        super(404, 404, message)
    }
}
