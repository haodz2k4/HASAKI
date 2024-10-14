import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import accountModel from "../../models/account.model";

//[GET] "/admin/accounts"
export const accounts = catchAsync(async (req: Request, res: Response) => {

    const accounts = await accountModel.find({deleted: false})
    res.render("admin/pages/accounts/account.pug",{
        pageTitle: "Quản lý tài khoản",
        activePages: "accounts",
        accounts
    })
})