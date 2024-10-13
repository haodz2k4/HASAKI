import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RenderError } from "../../utils/error";
import {JwtPayload, verify} from "jsonwebtoken"
import config from "../../config/config";
import userModel from "../../models/user.model";


export const requireAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.headers.authorization){
        throw new RenderError(401,"Bạn chưa đăng nhập");
    }
    const token = req.headers.authorization.split(" ")[1];
    const payload = verify(token,config.jwt_user.jwt_access_secret as string);
    const {id} = payload as JwtPayload; 
    const user = await userModel.findOne({_id: id, deleted: false});
    if(!user){
        throw new RenderError(401,"Token không hợp lệ");
    }
    if(user.status === 'inactive'){
        throw new RenderError(403,"Tài khoản của bạn đã bị khóa");
    }
    res.locals.user = user
    next()
})