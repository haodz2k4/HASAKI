
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RenderError } from "../../utils/error";
import {JwtPayload, verify} from "jsonwebtoken"
import config from "../../config/config";
import userModel from "../../models/user.model";


export const requireAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.cookies.accessToken;
    if(!token){
        throw new RenderError(401,"Vui lòng đăng nhập","/users/login")
    }
    const payload = verify(token,config.jwt.user.jwt_access_secret as string);
    const {id} = payload as JwtPayload; 
    const user = await userModel.findOne({_id: id, deleted: false});
    if(!user){
        throw new RenderError(401,"Token không hợp lệ","/users/login");
    }
    if(user.status === 'inactive'){
        throw new RenderError(403,"Tài khoản của bạn đã bị khóa");
    }
    res.locals.user = user
    next()
})