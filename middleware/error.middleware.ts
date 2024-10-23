import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { RenderError } from "../utils/error";
import { ApiError } from "../api/utils/error";
import { MongooseError } from "mongoose";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";


export default (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    if(err instanceof RenderError){
        switch(err.statusCode) {
            case 404: 
                res.status(err.statusCode).render("common/404.pug", {
                    message: err.message
                })
                break;
            case 401: 
            case 400: 
                req.flash('error',err.message)
                res.redirect(err.redirect ? err.redirect : "back");
                break;
            case 403: 
                res.status(err.statusCode).render('common/403.pug',{
                    err: err.message
                })
                break;
            default: 
            res.status(500).render("common/500.pug",{})
            break;
        }
    }else if(err instanceof MongooseError) {
        switch(err.name) {
            case 'ValidationError':
            case 'ValidatorError': 
                req.flash('error', err.message)
                res.redirect("back")
                break;
            default: 
                res.status(500).render('common/500.pug', { err });
                break;
        }
    }else if (err instanceof TokenExpiredError) {
        req.flash('error','token đã hết hạn');
        res.redirect("back");
        
    }else if (err instanceof JsonWebTokenError) {
        req.flash('error','token không hợp lệ');
        res.redirect("back");
    }
    else if (err instanceof ApiError){
        res.status(err.statusCode).json({statusCode: err.statusCode, message: err.message})
        
    }else {
        res.status(500).render("common/500.pug", {
            err
        })
    }
}