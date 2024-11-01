import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import orderModel from "../../models/order.model";

//[GET] "/admin/orders"
export const order = catchAsync(async (req: Request, res: Response) => {
    const orders = await orderModel.find({deleted: false}).populate('userId','fullName')
    res.render("admin/pages/orders/order.pug",{
        orders,
        activePages: 'orders'
    })
})