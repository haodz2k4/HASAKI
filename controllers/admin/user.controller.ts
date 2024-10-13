import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import userModel from "../../models/user.model";

//[GET] "/admin/users"
export const users = catchAsync(async (req: Request, res: Response) => {
    
    
    res.render("admin/pages/users/user.pug",{
        pageTitle: "Quản lý người dùng",
        activePages: "users"
    })
})