import { sign } from "jsonwebtoken";
import config from "../config/config";

export const generateUserAccessToken = async (id: string,) => {

    return await sign({
        _id: id,
    }, config.jwt_user.jwt_access_secret as string,{
        expiresIn: config.jwt_user.jwt_access_expire
    })
}

export const generateUserRefreshToken = async (id: string) => {

    return await sign({
        _id: id,
    }, config.jwt_user.jwt_refresh_secret as string,{
        expiresIn: config.jwt_user.jwt_access_expire
    })
}