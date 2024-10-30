import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

//[GET] "/checkout"
export const checkout = catchAsync(async (req: Request, res: Response) => {
    res.render("clients/pages/checkout/checkout.pug")
})