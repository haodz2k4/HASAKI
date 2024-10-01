import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import UserModel from "../models/user.model";

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token
    if(access_token){
        const payload = await verify(access_token,"sonhao");
        const userId = payload.sub;
        const user = await UserModel.findOne({_id: userId, deleted: false});
        res.locals.user = user 
    }
    next()
}