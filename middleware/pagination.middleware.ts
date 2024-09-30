import { NextFunction, Request, Response } from "express";


export const pageSizePagination = (req: Request, res: Response, next: NextFunction) => {
    try {
        const originalRender = res.render.bind(res);
        const pagination = {}
        res.render = (view: string, locals?: Record<string, any>) => {
            const transformedLocals = {
                ...locals,
                
            };
    
            return originalRender(view, transformedLocals);
        };

    } catch (error) {
        next(error)
    }
}