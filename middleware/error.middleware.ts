import { Request, Response, NextFunction, ErrorRequestHandler} from "express"; 
import { ResponseError } from "../utils/error.utils";


export const handleErrorMiddleware = (error: ErrorRequestHandler,req: Request, res: Response, next: NextFunction) => {
    
    if(error instanceof ResponseError){
        switch(error.code){
            case 404: 
                res.render("common/404.pug",{
                    pageTitle: error.message
                })
            break;
            case 400: 

            break;
        }
    }
    next()
}