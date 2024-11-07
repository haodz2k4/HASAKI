import orderModel from "../../models/order.model";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { RenderError } from "../../utils/error";

//[GET] "/orders/:id"
export const order = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const userId = res.locals.user.id 
    const order = await orderModel.findOne({_id: id,'user.userId': userId, deleted: false}).populate('products.productId','title thumbnail')
    if(!order){
        throw new RenderError(404,"Order is not found");
    }
    res.render("clients/pages/orders/order.pug",{
        order
    })

})

//[PATCH] "/orders/:id/confirmed"
export const confirmedOrder = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const order = await orderModel.findOne({_id: id});
    if(!order){
        throw new RenderError(404,"Order is not found")
    }
    order.isConfirmed = true;
    await order.save()
    req.flash('success','Đơn hàng xác nhận thành công')
    res.redirect("back");
})