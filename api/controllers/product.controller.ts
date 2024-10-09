import { Request, Response } from 'express';
import { catchAsync } from "../utils/catchAsync";
import * as productService from "../services/product.service";
//[GET] "/api/products"
export const getProducts = catchAsync(async (req: Request, res: Response) => {

    const products = await productService.getProducts({})
    res.json({products})
})