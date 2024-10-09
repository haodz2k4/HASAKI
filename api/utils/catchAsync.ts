import { Request, Response, NextFunction } from "express";
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any> ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res,next)
        } catch (error) {
            await next(error);
        }
    }
} 