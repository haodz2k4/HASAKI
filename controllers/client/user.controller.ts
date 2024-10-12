import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";

//[GET] "/users/login"
export const login = catchAsync(async (req: Request, res: Response) => {
    res.render("clients/pages/auth/login.pug")
})