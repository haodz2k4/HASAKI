import userModel from "../../models/user.model";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { RenderError } from "../../utils/error";
import { generateUserAccessToken, generateUserRefreshToken } from "../../helpers/token.helper";


//[GET] "/users/login"
export const login = catchAsync(async (req: Request, res: Response) => {
    res.render("clients/pages/auth/login.pug")
})

//[POST] "/users/login"
export const loginPost = catchAsync(async (req: Request, res: Response) => {
    const {email, password, remember} = req.body;
    
    const user = await userModel.findOne({email, deleted: false}).select("+password");
    if(!user || !user.isPasswordMatch(password)){
        throw new RenderError(401,"Invalid email or password");
    }
    if(user.status === 'inactive'){
        throw new RenderError(401,"Account has been locked");
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
    res.render("clients/pages/auth/register.pug")
})

//[POST] "/users/register"
export const registerPost = catchAsync(async (req: Request, res: Response) => {
    const body = req.body;
    await userModel.create(body);
    req.flash('success','Đăng ký thành công')
    res.redirect("/users/login")
})