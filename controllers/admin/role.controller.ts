import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";


//[GET] "/admin/roles"
export const roles = catchAsync(async (req: Request, res: Response) => {
    res.render("admin/pages/roles/role.pug",{
        pageTitle: "Quản lý vai trò",
        activePages: "roles",
    })
})