import { catchAsync } from "../utils/catchAsync";
import { Request, Response } from "express";
import * as userService from "../services/user.service"
//[PATCH] "/api/users/:id"
export const updateUser = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const body = req.body;
    const user = await userService.updateUserById(id,body)
    res.status(200).json({message: 'Update user successfully', user})
})