
export class RenderError extends Error {
    public statusCode: number;
    public redirect?: string;
    constructor(statusCode: number, message: string, redirect?: string) {
        super(message)
        this.name = 'RenderError'
        this.statusCode = statusCode
        this.redirect = redirect
        Error.captureStackTrace(this, this.constructor)
    }
}