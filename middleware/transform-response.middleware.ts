import { Request, Response, NextFunction } from "express";


export const TransFormDataResponse = (req: Request, res: Response, next: NextFunction) => {

    const originalRender = res.render.bind(res);
    res.render = (view: string, locals?: Record<string, any>) => {
        const transformedLocals = {
            success: true,
            message: 'Rendered successfully',
            data: locals,
            pageTitle: locals?.pageTitle || "HASAGHI"
        };

        return originalRender(view, transformedLocals);
    };

    next();
}