import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { RenderError } from "../utils/error";


export default (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof RenderError){
        switch(err.statusCode) {
            case 404: 
            res.render("common/404.pug")
            break;
            case 500: 
            res.render("common/500.pug");
            break;
            default: 
            res.render("common/500.pug")
            break;
        }
    }else {
        res.render("common/500.pug")
    }
}