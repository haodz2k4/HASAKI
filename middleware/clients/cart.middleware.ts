import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import cartModel from "../../models/cart.model";

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if(user){
        let cart = await cartModel.findOne({userId: user.id});
        if(!cart){
           cart = await cartModel.create({userId: user.id});
        }
        res.locals.cart = cart
    } 
    next()
})