import { IOrderProduct } from './../../models/order.model';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import productModel from "../../models/product.model";
import { RenderError } from "../../utils/error";

//[POST] "/checkout"
export const checkoutPost = catchAsync(async (req: Request, res: Response) => {
    const items = JSON.parse(req.body.items);
    const products: Record<string, any>[] = [];
    let total = 0;
    for(const item of items) {
        const {quantity, id} = item;
        const product = await productModel.findOne({_id: id});
        if(!product || product.status === 'inactive'){
            throw new RenderError(400,"Sản phẩm không hợp lệ");
        }   
        product.quantity = quantity
        product.totalPrice = (product.price * (100 - product.discountPercentage) / 100) * quantity
        total += product.totalPrice
        products.push(product)
        
    }
    
    res.render("clients/pages/checkout/checkout.pug",{
        products,
        total
    })
})