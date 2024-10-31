
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RenderError } from "../../utils/error";
import {JsonWebTokenError, JwtPayload, TokenExpiredError, verify} from "jsonwebtoken"
import config from "../../config/config";
import userModel from "../../models/user.model";


export const requireAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.cookies.accessToken;
    const redirect = `/users/login?redirect=${req.originalUrl}`
    if(!token){
        throw new RenderError(401,"Vui lòng đăng nhập",redirect)
    }
    try {
        const payload = verify(token,config.jwt.user.jwt_access_secret as string);
        const {_id} = payload as JwtPayload; 
        const user = await userModel.findOne({_id, deleted: false});
        if(!user){
            throw new RenderError(401,"Token không hợp lệ hoặc người dùng không được tìm thấy","/users/login");
        }
        if(user.status === 'inactive'){
            throw new RenderError(403,"Tài khoản của bạn đã bị khóa");
        }
        res.locals.user = user
        next()
    } catch (error) {
        if(error instanceof TokenExpiredError || error instanceof JsonWebTokenError){
            throw new RenderError(401,"Vui lòng đăng nhập lại",redirect);
        }

    }
})