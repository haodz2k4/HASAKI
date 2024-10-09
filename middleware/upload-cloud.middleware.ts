import { Request, Response, NextFunction } from "express"
import {v2} from "cloudinary"
import config from "../config/config"
v2.config(config.cloudinary)
export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.file){
            const {path, fieldname} = req.file;
            req.body[fieldname] = path;
        }
        next()
    } catch (error) {
        next(error)
    }
}