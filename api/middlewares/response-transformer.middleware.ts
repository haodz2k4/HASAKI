import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {

    const originalJSON = res.json.bind(res);

    res.json = (data) => {
        const responseTransform = {
            statusCode: res.statusCode,
            message: data.message || 'Success',
            data 
        }
        return originalJSON(responseTransform)
    }
    next()
}