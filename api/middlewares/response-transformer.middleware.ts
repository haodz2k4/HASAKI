import { NextFunction, Request, Response } from "express";
/*
{
  statusCode: <statusCode>,
  message: data.message,
  data
}
*/
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