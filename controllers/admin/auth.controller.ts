import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';

//[GET] "/admin/auth/login"
export const login = catchAsync(async (req: Request, res: Response) => {

    res.render("admin/pages/auth/login.pug")
})