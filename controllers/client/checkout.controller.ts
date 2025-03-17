import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import productModel, { IProduct } from "../../models/product.model";
import { RenderError } from "../../utils/error";
import orderModel, { IOrderProduct } from "../../models/order.model";
import config from "../../config/config";
import CryptoJS from "crypto-js";
import axios from "axios";
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
    const cart = res.locals.cart;
    cart.products = cart.products.filter(
        (product: Record<string, any>) => !productIds.has(product.productId.id)
    )
    await cart.save()
    req.flash('success','Đặt hàng thành công')
    res.redirect(`/checkout/order/${order.id}/success`)
}) 

//[POST] "checkout/order/momo/payment"
export const checkOutMomo = catchAsync(async (req: Request, res: Response) => {
    const productsJson = JSON.parse(req.body.products) as IProduct[];
    const products: IOrderProduct[] = productsJson.map((item: Record<string, any>) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discountPercentage: item.discountPercentage,
    }));

    const defaultAddressIndex = parseInt(req.body.defaultAddressIndex) || 0;
    const paymentMethod = req.body.paymentMethod;
    const user = res.locals.user;

    // Tạo đơn hàng trong DB
    const order = await orderModel.create({
        user: {
            userId: user.id,
            email: user.email,
            phone: user.phone,
            address: user.addresses[defaultAddressIndex],
        },
        paymentMethod,
        products,
    });

    // Xóa sản phẩm khỏi giỏ hàng
    const productIds = new Set(productsJson.map((item: Record<string, any>) => item.productId));
    const cart = res.locals.cart;
    cart.products = cart.products.filter(
        (product: Record<string, any>) => !productIds.has(product.productId.id)
    )
    await cart.save();

    // ✅ Xử lý thanh toán qua MoMo
    const partnerCode = config.momo.partnerCode!;
    const accessKey = config.momo.accessKey!;
    const secretKey = config.momo.secretKey!;
    const endpoint = config.momo.endpoint!;
    const orderId = order.id.toString();
    const requestId = partnerCode + new Date().getTime();
    const orderInfo = "Thanh toán đơn hàng với MoMo";
    const amount = products.reduce((total: number, item: any) => {
        return  total += (item.price * (100 - item.discountPercentage) / 100) * item.quantity 
    },0) + 20;
    const ipnUrl = `${config.appUrl}/checkout/order/momo/payment/notify`;
    const redirectUrl = `${config.appUrl}/checkout/order/${order.id}/success`;
    const extraData = "";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
    const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString(CryptoJS.enc.Hex);

    const momoData = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType: "captureWallet",
        signature,
        lang: "vi",
    };

    const response = await axios.post(endpoint, momoData, {
        headers: { "Content-Type": "application/json" },
    });

    res.redirect(response.data.payUrl);
    
});

//[POST] 'checkout/order/momo/payment/notify'


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