import { Request, Response } from 'express';
import { catchAsync } from "../utils/catchAsync";
import * as productService from "../services/product.service";
import pick from '../utils/pick';
import { sortType } from '../utils/types/sort';
import { IProduct } from '../../models/product.model';
//[GET] "/api/products"
export const getProducts = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query,["status", "highlighted","categoryId","keyword"]);
    //Pagination 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    //sorting 
    const sortKey = req.query.sortKey as keyof IProduct
    const sortValue = req.query.sortValue as sortType;
    const products = await productService.getProducts({
        filter, 
        page, 
        limit,
        sortKey,
        sortValue
    })
    res.json(products)
})