
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

//[POST] "/cart/add/:productId"
export const add = catchAsync(async (req: Request, res: Response) => {
    const {productId} = req.params;
    const quantity = parseInt(req.body.quantity)
    const cart = res.locals.cart;
    const index: number = cart.products.findIndex((item: Record<string, any>) => item.productId.id.toString() === productId);
    if(index === -1 ){
        cart.products.push({
            productId,
            quantity
        })
    }else{
        cart.products[index].quantity += quantity
    }
    await cart.save()
    req.flash('success','Thêm sản phẩm vào giỏ hàng thành công');
    res.redirect("back");

}) 

//[DELETE] "/cart/remove/:productId"
export const removeProductFormcart = catchAsync(async (req: Request, res: Response) => {
    const {productId} = req.params;
    const cart = res.locals.cart 
    const index = cart.products.findIndex((item: Record<string, any>) => item.productId.id.toString() === productId)
    if(index !== -1) {
        cart.products.splice(index, 1);
        await cart.save()
    }
    res.redirect("back");
})

//[PATCH] "/cart/update/multi/:type"
export const updateMulti = catchAsync(async (req: Request, res: Response) => {
    const ids = JSON.parse(req.body.ids)
    console.log(ids)
    const {type} = req.params
    const cart = res.locals.cart;
    switch(type) {
        case 'remove': 
            cart.products.forEach((item: Record<string, any>, index: number) => {
                if(ids.includes(item.productId.id.toString())){
                    cart.products.splice(index,1)
                }
            })
            await cart.save()
            break;
        case 'inactive': 
            cart.products.forEach((item: Record<string, any>, index: number) => {
                if(ids.includes(item.productId.id.toString())){
                    cart.products.splice(index,1)
                }
            })
            await cart.save()
            break;
        case 'oufof-stock': 
            cart.products.forEach((item: Record<string, any>, index: number) => {
                if(ids.includes(item.productId.id.toString())){
                    cart.products.splice(index,1)
                }
            })
            await cart.save()
            break;
        case 'favorite-list': 
            const favoriteList = await res.locals.favoriteList;
            const newIds = ids.filter((id: string) => !favoriteList.productIds.includes(id));
            favoriteList.productIds = [...favoriteList.productIds, ...newIds]
            await favoriteList.save()
            req.flash('success','Thêm vào danh sách yêu thích thành công')
            break;
    }
    res.redirect("back")
})