import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RenderError } from "../../utils/error";

export const checkoutPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const items = JSON.parse(req.body.items);
    if(items.length === 0){
        throw new RenderError(400,"Vui lòng chọn ít nhất một sản phẩm")
    }
    next()
})

export const orderPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = res.locals.user;
    if(user.addresses.length === 0){
        throw new RenderError(400,"Vui lòng thêm 1 địa chỉa để đặt hàng")
    }

    next()
})