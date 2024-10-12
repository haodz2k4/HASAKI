import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { RenderError } from "../utils/error";
import { ApiError } from "../api/utils/error";


export default (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    if(err instanceof RenderError){
        switch(err.statusCode) {
            case 404: 
            res.render("common/404.pug", {
                message: err.message
            })
            break;
            case 401: 
                req.flash('error',err.message)
                res.redirect('back');
            case 500: 
            res.render("common/500.pug");
            break;
            default: 
            res.render("common/500.pug")
            break;
        }
    }else if (err instanceof ApiError){
        res.status(err.statusCode).json({statusCode: err.statusCode, message: err.message})
        
    }else {
        res.render("common/500.pug", {
            err
        })
    }
}