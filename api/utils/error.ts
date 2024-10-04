
export class ApiError extends Error {
    public code: number 

    constructor(code: number, message: string) {
        super(message)
        this.name = 'ApiError'
        this.code = code

        Error.captureStackTrace(this, this.constructor)

        
    }
}