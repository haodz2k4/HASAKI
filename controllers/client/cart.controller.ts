import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

//[GET] "/cart"
export const cart = catchAsync(async (req: Request, res: Response) => {

    const cart = res.locals.cart
    res.render("clients/pages/cart/cart.pug",{
        cart
    });
}) 

//[POST] "/cart/add/:id"
export const add = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const {quantity} = req.body
    const cart = res.locals.cart 
    cart.products.push({
        productId: id,
        quantity
    })
    await cart.save()
    req.flash('success','Thêm sản phẩm vào giỏ hàng thành công');
    res.redirect("back");

})
