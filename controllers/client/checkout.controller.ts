import { products } from './product.controller';

import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import productModel, { IProduct } from "../../models/product.model";
import { RenderError } from "../../utils/error";
import orderModel, { IOrderProduct } from "../../models/order.model";
import cartModel, { IProductCart } from "../../models/cart.model";

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
        const { title, price, discountPercentage, thumbnail, newPrice} = product
        const totalPrice = (product.price * (100 - product.discountPercentage) / 100) * quantity
        total += totalPrice
        products.push({
            productId: product.id,
            title,
            price,
            discountPercentage,
            quantity,
            thumbnail,
            newPrice,
            totalPrice
        })
        
    }
    
    res.render("clients/pages/checkout/checkout.pug",{
        products,
        total
    })
}) 

//[POST] "/checkout/order"
export const orderPost = catchAsync(async (req: Request, res: Response) => {
    const productsJson = JSON.parse(req.body.products) as IProduct[]
    const products: IOrderProduct[] = productsJson.map((item: Record<string, any>) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discountPercentage: item.discountPercentage
    }))
    const defaultAddressIndex = parseInt(req.body.defaultAddressIndex) || 0
    const paymentMethod = req.body.paymentMethod
    const user = res.locals.user 
    const order = await orderModel.create({
        user: {
            userId: user.id,
            email: user.email,
            phone: user.phone,
            address: user.addresses[defaultAddressIndex],
        },
        paymentMethod,
        products
    })
    //remove cart item after order
    const productIds = new Set(productsJson.map((item: Record<string, any>) => item.productId));
    console.log(productIds)
    const cart = res.locals.cart;
    console.log(cart.products.filter(
        (product: Record<string, any>) => !productIds.has(product.productId.id)
    ))
    cart.products = cart.products.filter(
        (product: Record<string, any>) => !productIds.has(product.productId.id)
    )
    await cart.save()
    req.flash('success','Đặt hàng thành công')
    res.redirect(`/checkout/order/${order.id}/success`)
}) 

//[GET] "/checkout/order/:id/success"
export const orderSuccess = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const userId = res.locals.user.id 
    const order = await orderModel.findOne({_id: id,'user.userId': userId, deleted: false});
    if(!order){
        throw new RenderError(401,"Order is not found");
    }
    res.render("clients/pages/checkout/success.pug",{
        order
    })
})