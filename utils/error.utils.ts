export class ResponseError extends Error {
    code: number 

    constructor(code: number, message: string) {
        super(message)
        this.name = 'ResponseError'
        this.code = code

        Error.captureStackTrace(this, this.constructor)

        
    }
    
}