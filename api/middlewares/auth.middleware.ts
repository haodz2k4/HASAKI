import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/error";
import { JwtPayload, verify } from "jsonwebtoken";
import config from "../../config/config";
import { getAccountById } from "../services/account.service";

export const requireAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization){
        throw new ApiError(401,"Token is must provided")
    }
    const token = req.headers.authorization.split(" ")[1];
    const payload = verify(token,config.jwt.admin.jwt_access_secret as string);
    const {_id} = payload as JwtPayload;

    const account = await getAccountById(_id);
    if(!account){
        throw new ApiError(401,"Account is not found");
    }
    res.locals.account = account
    next()

})

export const requirePermission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const account = res.locals.account;
        //if role is admin check the permission and if role is user not check 
        if(account){
            if(!account.roleId.permissions.includes(permission)){
                throw new ApiError(403,"You do not have enough authority")
            }
        }
        next()
    }
}