import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import roleModel from "../../models/role.model";
import paginationHelper from "../../helpers/pagination.helper";


//[GET] "/admin/roles"
export const roles = catchAsync(async (req: Request, res: Response) => {
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const [roles, total] = await Promise.all([
        await roleModel
        .find({deleted: false})
        .skip(skip)
        .limit(limit),
        await roleModel.countDocuments({deleted: false})
    ])
    const pagination = paginationHelper(page, limit,total)
    res.render("admin/pages/roles/role.pug",{
        pageTitle: "Quản lý nhóm quyền",
        activePages: "roles",
        roles,
        pagination
    })
})