import { IProductCart } from './../../models/cart.model';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

//[GET] "/cart"
export const cart = catchAsync(async (req: Request, res: Response) => {

    const cart = res.locals.cart

    cart.products.forEach((item: Record<string, any>) => {
        item.totalPrice = (item.productId.price * (100 - item.productId.discountPercentage) / 100) * item.quantity
    })
    res.render("clients/pages/cart/cart.pug",{
        cart
    });
}) 

//[POST] "/cart/add/:id"
export const add = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const quantity = parseInt(req.body.quantity)
    const cart = res.locals.cart 
    const index: number = cart.products.findIndex((item: IProductCart) => item.productId.id.toString() === id);
    if(index === -1 ){
        cart.products.push({
            productId: id,
            quantity
        })
    }else{
        cart.products[index].quantity += quantity
    }
    
    await cart.save()
    req.flash('success','Thêm sản phẩm vào giỏ hàng thành công');
    res.redirect("back");

})
