
import userModel from "../../models/user.model";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { RenderError } from "../../utils/error";
import { generateResetPasswordToken, generateUserAccessToken, generateUserRefreshToken, generateVerifyEmailToken } from "../../helpers/token.helper";
import { sendMail } from "../../helpers/mail.helper";
import {  readFileSync } from 'fs';
import path from "path"
import { generateRandomString } from '../../helpers/generate';
import forgotPasswordModel from "../../models/forgot-password.model";
import { JwtPayload, verify } from "jsonwebtoken";
import config from "../../config/config";
import ms from "ms";
import { getDomain } from "../../helpers/domain.helper";
import orderModel from "../../models/order.model";
import pick from "../../utils/pick";

//[GET] "/users/login"
export const login = catchAsync(async (req: Request, res: Response) => {
    res.render("clients/pages/users/login.pug")
})

//[POST] "/users/login"
export const loginPost = catchAsync(async (req: Request, res: Response) => {
    const {email, password, remember} = req.body;
    
    const user = await userModel.findOne({email, deleted: false}).select("+password");
    if(!user || ! await user.isPasswordMatch(password)){
        throw new RenderError(401,"Email hoặc password không hợp lệ");
    }
    if(user.status === 'inactive'){
        throw new RenderError(403,`Tài khoản đã bị khóa`);
    }
    if(!user.isVerified){
        throw new RenderError(401,"Tài khoản chưa được xác thực")
    }
    //Access Token 
    const accessToken = await generateUserAccessToken(user.id);
    res.cookie('accessToken', accessToken,{
        maxAge: ms(config.jwt.user.jwt_access_expire as string)
    })
    if(remember === 'on'){
        const refreshToken = await generateUserRefreshToken(user.id);
        res.cookie('refreshToken', refreshToken)
    }
    req.flash('success','Đăng nhập thành công')
    const redirect = req.query.redirect as string || "/"
    res.redirect(redirect);

})

//[GET] "/users/register"
export const register = catchAsync(async (req: Request, res: Response) => {
    res.render("clients/pages/users/register.pug")
})  

//[POST] "/users/register"
export const registerPost = catchAsync(async (req: Request, res: Response) => {
    const body = req.body;
    const {email} =req.body
    const user = await userModel.create(body)
    const domain = getDomain(req)
    const token = await generateVerifyEmailToken(user.id)

    const verifyPath = `${domain}/users/verify-email?token=${token}`
    const pathTemplate = path.join(__dirname,"../../templates/verify-email.html");
    const htmlContent = await readFileSync(pathTemplate,"utf8")
        .replace('{{verification_link}}', verifyPath)
    sendMail(email,'VUI LÒNG XÁC THỰC TÀI KHOẢN',{html: htmlContent});
    req.flash('success','Vui lòng kiểm tra email')
    res.redirect('back')
})

//[GET] "/users/verify-email"
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const {token} = req.query;
    const payload = verify(token as string, config.jwt.user.jwt_verify_email_secret as string);
    const {_id} = payload as JwtPayload
    const user = await userModel.findOne({_id, deleted: false});
    if(!user){
        throw new RenderError(400,"Xác thực email thất bại","/users/register")
    }
    user.isVerified = true;
    await user.save()
    req.flash('success','Xác thực thành công vui lòng đăng nhập');
    res.redirect("/users/login");
    
    
})

//[POST] "/users/logout"
export const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    req.flash('success','Đăng xuất thành công')
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
        email
    })
    if(!forgotPassword){
        throw new RenderError(400,"Không tìm thấy email")
    }
    if(forgotPassword.isUsed) {
        throw new RenderError(401,"Otp đã được sử dụng")
    }
    if(! await forgotPassword.isMatchOtp(otp)){
        throw new RenderError(401,"Invalid otp")
    }
    forgotPassword.isUsed = true;
    await forgotPassword.save()

    //Generate Token 
    const tokenReset = await generateResetPasswordToken(email,'5m');
    res.cookie('tokenReset', tokenReset)
    req.flash('success','Xác thực otp thành công')
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
    const payload = verify(token,config.jwt.user.jwt_password_reset_secret as string);
    const {email} = payload as JwtPayload;
    const user = await userModel.findOne({email, status: "active",deleted: false});
    if(!user){
        throw new RenderError(401,"User is not found");
    }
    const {password,repeatPassword } = req.body;
    if(password !== repeatPassword){
        throw new RenderError(400,"Invalid repeat password")
    }
    Object.assign(user, {password});
    await user.save()
    res.clearCookie('tokenReset')
    req.flash('success','Thay đổi mật khẩu thành công. vui lòng đăng nhập lại')
    res.redirect("/users/login")
})

//[GET] "/users/profiles"
export const getProfiles = catchAsync(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const orders = await orderModel.find({'user.userId': userId, deleted: false}).populate('products.productId','title slug thumbnail');

    res.render("clients/pages/users/profile.pug",{
        orders
    })
}) 


//[PATCH] "/users/profiles"
export const updateProfiles = catchAsync(async (req: Request, res: Response) => {
    const body = req.body;
    const user = res.locals.user; 
    Object.assign(user, body);
    await user.save()
    req.flash('success','Cập nhật profiles thành công')
    res.redirect("back");
}) 

//[POST] "/users/add-address"
export const addAddress = catchAsync(async (req: Request, res: Response) => {
    const {street, city, country} = req.body;
    const user = await res.locals.user; 
    user.addresses.push({street, city, country});
    await user.save()
    req.flash('success','Thêm địa chỉ thành công')
    res.redirect("back")
})

//[DELETE] "/users/remove-address/:index"
export const removeAddres = catchAsync(async (req: Request, res: Response) => {
    const index = parseInt(req.params.index);
    
    const user = await res.locals.user; 
    if(index === user.defaultAddressIndex){
        user.defaultAddressIndex = 0
    }
    user.addresses.splice(index, 1)
    await user.save()
    res.redirect("back")
})

//[PATCH] "/users/update-password"
export const updatePassword = catchAsync(async (req: Request, res: Response) => {
    const {currentPassword, newPassword, repeatPassword} =req.body;
    const user = res.locals.user;
    console.log(currentPassword)
    if(! await user.isPasswordMatch(currentPassword)){
        throw new RenderError(401,"Mật khẩu hiện tại không đúng yêu cầu nhập lại");
    }
    if(newPassword !== repeatPassword){
        throw new RenderError(401,"Mật khẩu nhập lại không đúng")
    }
    user.password = newPassword;
    await user.save();
    req.flash('success','Cập nhật mật khẩu thành công')
    res.redirect("back")
})

//[GET] /users/upload-avatar
export const uploadAvatar = catchAsync(async (req: Request,res: Response) => {
    const user = res.locals.user;
    const {avatar} = req.body;
    user.avatar = avatar;
    await user.save()
    req.flash('success','Tải ảnh đại diện lên thành công');
    res.redirect("back")
})

//[PATCH] "/users/update-address/:index"
export const updateAddress = catchAsync(async (req: Request, res: Response) => {
    const {index} = req.params;
    const user = res.locals.user;
    const body = req.body
    console.log(body)
    const data = pick(body,["city","street","country"])
    console.log(data)
    Object.assign(user.addresses[index], data)
    await user.save()
    req.flash('success','Cập nhật địa chỉ thành công')
    res.redirect("back");

})