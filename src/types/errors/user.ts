import { APIError } from '@/types/errors/error'

export class SignInFailedError extends APIError {
    constructor() {
        super(401, 601, 'login failed')
        Object.setPrototypeOf(this, SignInFailedError.prototype)
        Error.captureStackTrace(this, SignInFailedError)
    }
}

export class SignUpFailError extends APIError {
    constructor() {
        super(400, 602, 'Signup failed')
        Object.setPrototypeOf(this, SignUpFailError)
        Error.captureStackTrace(this, SignUpFailError)
    }
}
