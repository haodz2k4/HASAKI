import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import accountModel from '../../models/account.model';
import { RenderError } from '../../utils/error';
import { generateAdminAccessToken } from '../../helpers/token.helper';

//[GET] "/admin/auth/login"
export const login = catchAsync(async (req: Request, res: Response) => {
    res.render("admin/pages/auth/login.pug")
})

//[POST] "/admin/auth/login"
export const loginPost = catchAsync(async (req: Request, res: Response) => {
    const {email, password} =req.body;
    const account = await accountModel.findOne({email}).select("+password");
    if(!account || !account.isMatchPassword(password)){
        throw new RenderError(401,"Invalid Email Or Password")
    }
    const adminAccessToken = await generateAdminAccessToken(account.id);
    res.cookie('adminAccessToken', adminAccessToken)
    res.redirect("/admin/dashboard")
}) 

//[POST] "/admin/auth/logout"
export const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie('adminAccessToken')
    res.redirect("/admin/auth/login")
})