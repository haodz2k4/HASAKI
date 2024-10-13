import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import userModel from "../../models/user.model";

import paginationHelper from "../../helpers/pagination.helper";

//[GET] "/admin/users"
export const users = catchAsync(async (req: Request, res: Response) => {
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const [users, count] = await Promise.all([
        await userModel.find({deleted: false}),
        await userModel.countDocuments({deleted: false})
    ])
    const pagination = paginationHelper(page, limit, count);
    res.render("admin/pages/users/user.pug",{
        pageTitle: "Quản lý người dùng",
        activePages: "users",
        users,
        pagination
    })
})