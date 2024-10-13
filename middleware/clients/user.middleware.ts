import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload, verify } from "jsonwebtoken";
import config from "../../config/config";
import userModel from "../../models/user.model";

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.cookies.accessToken;
    if(token){
        try {
            const payload = verify(token,config.jwt_user.jwt_access_secret as string);
            const {_id} = payload as JwtPayload;
            const user = await userModel.findOne({_id, deleted: false});
            if(user && user.status === 'active'){
                res.locals.user = user 
            }
            //If jwt expire or jwt invalid => next 
        } catch {}
        
    }
    next()
})