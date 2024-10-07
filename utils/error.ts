
export class RenderError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message)
        this.name = 'RenderError'
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)
    }
}