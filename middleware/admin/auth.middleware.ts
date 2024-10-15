import { catchAsync } from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { RenderError } from "../../utils/error";
import { JwtPayload, verify } from "jsonwebtoken";
import config from "../../config/config";
import accountModel from "../../models/account.model";


export const requireAuth = catchAsync(async (req: Request, res: Response,next: NextFunction) => {
    const adminAccessToken = req.cookies.adminAccessToken;
    if(!adminAccessToken){
        throw new RenderError(401,"Vui lòng đăng nhập","/admin/auth/login")
    }
    try {
        const payload = verify(adminAccessToken,config.jwt.admin.jwt_access_secret as string);
        const {_id} = payload as JwtPayload;
        const account = await accountModel.findOne({_id, deleted: false});
        if(!account){
            throw new RenderError(401,"Không tìm thấy tài khoản","/admin/auth/login")
        }
        res.locals.account = account
        next()
    } catch{
        throw new RenderError(401,"Token không hợp lệ","/admin/auth/login")
    }
})