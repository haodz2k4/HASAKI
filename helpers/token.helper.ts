
import { sign } from "jsonwebtoken";
import config from "../config/config";
/***USER***/
export const generateUserAccessToken = async (id: string,) => {

    return await sign({
        _id: id,
    }, config.jwt.user.jwt_access_secret as string,{
        expiresIn: config.jwt.user.jwt_access_expire
    })
}

export const generateUserRefreshToken = async (id: string) => {

    return await sign({
        _id: id,
    }, config.jwt.user.jwt_refresh_secret as string,{
        expiresIn: config.jwt.user.jwt_access_expire
    })
}

/***ADMIN***/
export const generateAdminAccessToken = async (id: string) => {
    return await sign({
        _id: id 
    }, config.jwt.admin.jwt_access_secret as string,{
        expiresIn: config.jwt.admin.jwt_access_expire
    })
}

export const generateResetPasswordToken = async (email: string, expiresIn: string | number) => {
    return await sign({
        email 
    }, config.jwt.user.jwt_password_reset_secret as string,{
        expiresIn
    })
}

export const generateVerifyEmailToken = async (email: string) => {
    return await sign({
        email
    }, config.jwt.user.jwt_verify_email_secret as string,{
        expiresIn: config.jwt.user.jwt_verify_email_expire
    })
}