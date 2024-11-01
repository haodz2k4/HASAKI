import orderModel from "../../models/order.model";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";

//[GET] "/order/:id"
export const order = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const order = await orderModel.findOne({_id: id, deleted: false}).populate('products.productId','title thumbnail')
    res.render("clients/pages/checkout/tracking.pug",{
        order
    })

})