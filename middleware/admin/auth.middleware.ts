import { catchAsync } from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { RenderError } from "../../utils/error";
import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import config from "../../config/config";
import accountModel from "../../models/account.model";


export const requireAuth = catchAsync(async (req: Request, res: Response,next: NextFunction) => {
    const adminAccessToken = req.cookies.adminAccessToken;
    if(!adminAccessToken){
        throw new RenderError(401,"Vui lòng đăng nhập","/admin/auth/login")
    }
    const redirect = `/admin/auth/login`
    try {
        const payload = verify(adminAccessToken,config.jwt.admin.jwt_access_secret as string);
        const {_id} = payload as JwtPayload;
        const account = await accountModel.findOne({_id, deleted: false}).populate('roleId','title permissions');
        if(!account){
            throw new RenderError(401,"Không tìm thấy tài khoản",redirect)
        }
        res.locals.account = account
        next()
    } catch (error){
        if(error instanceof TokenExpiredError){
            throw new RenderError(401,"Phiên đăng nhập đã hết, vui lòng đăng nhập lại",redirect);
        }else if(error instanceof JsonWebTokenError){
            throw new RenderError(401,"Vui lòng đăng nhập",redirect);
        }else{
            next()
        }
    }
})