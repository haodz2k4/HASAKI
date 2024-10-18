import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/error";
import { JwtPayload, verify } from "jsonwebtoken";
import config from "../../config/config";
import { getAccountById } from "../services/account.service";

export const requireAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization){
        throw new ApiError(403,"Token is must provided")
    }
    const token = req.headers.authorization.split(" ")[1];
    const payload = verify(token,config.jwt.admin.jwt_access_secret as string);
    const {_id} = payload as JwtPayload;

    const account = await getAccountById(_id);
    if(!account){
        throw new ApiError(401,"Account is not found");
    }
    next()

})
