import { Request, Response } from 'express';
import { catchAsync } from "../utils/catchAsync";

//[GET] "/api/products"
export const getProducts = catchAsync(async (req: Request, res: Response) => {


    res.json({siu: "1234"})
})