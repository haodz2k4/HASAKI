import productModel from "../../models/product.model";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { RenderError } from "../../utils/error";


export const add = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {productId} = req.params;
    const {quantity} = req.body;

    const product = await productModel.findOne({_id: productId});
    if(!product){
        throw new RenderError(400,"Product is not found")
    }
    if(product.status === 'inactive'){
        throw new RenderError(400,"Product is invalid")
    }
    if(product.quantity === 0) {
        throw new RenderError(400,"Product is out of stock")
    }
    const productQuantity: number = product.quantity as number
    if(quantity > productQuantity){
        throw new RenderError(400,"Invalid quantity")
    }
    next()
})