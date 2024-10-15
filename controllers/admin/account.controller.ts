import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import accountModel from "../../models/account.model";
import roleModel from "../../models/role.model";
import paginationHelper from "../../helpers/pagination.helper";

//[GET] "/admin/accounts"
export const accounts = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    const [accounts, total] = await Promise.all([
        accountModel
            .find({deleted: false})
            .limit(limit)
            .skip(skip),
        accountModel.countDocuments({deleted: false})
    ])
    const pagination = paginationHelper(page, limit, total);
    res.render("admin/pages/accounts/account.pug",{
        pageTitle: "Quản lý tài khoản",
        activePages: "accounts",
        accounts,
        pagination
    })
})

//[GET] "/admin/accounts/create"
export const create = catchAsync(async (req: Request, res: Response) => {
    const roles = await roleModel.find({deleted: false})
    res.render("admin/pages/accounts/create.pug",{
        pageTitle: "Thêm tài khoản",
        activePages: "accounts",
        roles
    })
})