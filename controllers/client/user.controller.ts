
import userModel from "../../models/user.model";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { RenderError } from "../../utils/error";
import { generateResetPasswordToken, generateUserAccessToken, generateUserRefreshToken } from "../../helpers/token.helper";
import { sendMail } from "../../helpers/mail.helper";
import {  readFileSync } from 'fs';
import path from "path"
import { generateRandomString } from '../../helpers/generate';
import forgotPasswordModel from "../../models/forgot-password.model";
import { JwtPayload, verify } from "jsonwebtoken";
import config from "../../config/config";

//[GET] "/users/login"
export const login = catchAsync(async (req: Request, res: Response) => {
    res.render("clients/pages/users/login.pug")
})

//[POST] "/users/login"
export const loginPost = catchAsync(async (req: Request, res: Response) => {
    const {email, password, remember} = req.body;
    
    const user = await userModel.findOne({email, deleted: false}).select("+password");
    if(!user || !user.isPasswordMatch(password)){
        throw new RenderError(401,"Invalid email or password");
    }
    if(user.status === 'inactive'){
        throw new RenderError(403,`Tài khoản đã bị khóa`);
    }
    //Access Token 
    const accessToken = await generateUserAccessToken(user.id);
    res.cookie('accessToken', accessToken)
    if(remember === 'on'){
        const refreshToken = await generateUserRefreshToken(user.id);
        res.cookie('refreshToken', refreshToken)
    }

    res.redirect("/");

})

//[GET] "/users/register"
export const register = catchAsync(async (req: Request, res: Response) => {
    res.render("clients/pages/users/register.pug")
})  

//[POST] "/users/register"
export const registerPost = catchAsync(async (req: Request, res: Response) => {
    const body = req.body;
    await userModel.create(body);
    req.flash('success','Đăng ký thành công')
    res.redirect("/users/login")
})

//[POST] "/users/logout"
export const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.redirect("/users/login")
})

//[GET] "/users/forgot-password"
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    res.render("clients/pages/users/forgot-password.pug")
})

//[POST] "/users/forgot-password"
export const forgotPasswordPost = catchAsync(async (req: Request, res: Response) => {
    const {email} = req.body;
    
    const user = await userModel.findOne({email, deleted: false});
    if(!user){
        throw new RenderError(401,"Email không tồn tại");
    }
    const otp = generateRandomString(6)
    const filePath = path.join(__dirname,"../../templates/otp-email.html");
    const htmlContent = readFileSync(filePath,"utf8")
        .replace('{{fullName}}', user.fullName)
        .replace('{{otp}}',otp)
    await sendMail(email,"VUI LÒNG LẤY LẠI MẬT KHẨU",{html: htmlContent})
    //save info to forgot password
    await forgotPasswordModel.create({
        email: email,
        otp: otp,
        expireIn: Date.now() + 3*60*1000    
    })
    res.redirect("/users/verify-otp?email="+email)
})

//[GET] "/users/verify-otp"
export const verifyOtp = catchAsync(async (req: Request, res: Response) => {
    const {email} = req.query 
    res.render("clients/pages/users/verify-otp.pug",{
        email
    })
})

//[POST] "/users/verify-otp"
export const verifyOtpPost = catchAsync(async (req: Request, res: Response) => {
    const {email, otp} = req.body;
    const forgotPassword = await forgotPasswordModel.findOne({
        email,
        isUsed: false
    })
    console.log(forgotPassword)
    if(!forgotPassword || !forgotPassword.isMatchOtp(otp)){
        throw new RenderError(401,"Invalid otp")
    }
    Object.assign(forgotPassword,{
        isUsed: true 
    })
    await forgotPassword.save()

    //Generate Token 
    const tokenReset = await generateResetPasswordToken(email,'5m');
    res.cookie('tokenReset', tokenReset)
    req.flash('success','Xác thực thành công')
    res.redirect("/users/reset-password")
}) 

//[GET] "/users/reset-password"
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
    res.render("clients/pages/users/reset-password.pug")
})

//[POST] "/users/reset-password"
export const resetPasswordPost = catchAsync(async (req: Request, res: Response) => {
    const token = req.cookies.tokenReset;
   
    if(!token){
        res.redirect("back")
        return;
    }
    const payload = verify(token,config.jwt.jwt_password_reset_secret as string);
    const {email} = payload as JwtPayload;
    const user = await userModel.findOne({email, status: "active",deleted: false});
    if(!user){
        throw new RenderError(401,"User is not found");
    }
    const {password,repeatPassword } = req.body;
    console.log(req.body)
    if(password !== repeatPassword){
        throw new RenderError(400,"Mật khẩu nhập lại không đúng");
    }

    res.clearCookie('tokenReset')
    res.redirect("/users/login")
})