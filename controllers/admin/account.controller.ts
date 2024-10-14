import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

//[GET] "/admin/accounts"
export const accounts = catchAsync(async (req: Request, res: Response) => {
    res.render("admin/pages/accounts/account.pug",{
        pageTitle: "Quản lý tài khoản",
        activePages: "accounts"
    })
})