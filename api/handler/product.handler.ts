import { Request, Response } from "express"
import { getAllProductsByQuery, getTotalDocument, updateProductById } from "../../services/product.service"
import pick from "../../utils/pick"
import paginationHelper from "../../helpers/pagination.helper"
import rangePriceHelper from "../../helpers/range-price.helper"
import catchAsync from "../utils/catchAsync"
import { ApiError } from "../utils/error"
//[GET] "/api/products"
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Return a list of products 
 *     responses:
 *       200:
 *         description: A successful response
 */

export const getProducts = catchAsync(async (req: Request, res: Response) => {
    
    const query = pick(req.query,["status", "highlighted"]);
    const filter: Record<string, any> = {...query}
    //Sort
    const sortKey = req.query.sortKey as string;
    const sortValue = req.query.sortValue as "asc" | "desc";
    const sort: Record<string, "asc" | "desc"> = {}
    if(sortKey && sortValue) {
        sort[sortKey] = sortValue
    }
    //range price 
    const minPrice = parseInt(req.query.minPrice as string)
    const maxPrice = parseInt(req.query.maxPrice as string);
    
    filter.$and = rangePriceHelper(minPrice, maxPrice)
    //Search 
    const keyword = req.query.keyword as string;
    if(keyword){
        filter.keyword = keyword
    }
    //Pagination 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20 
    const skip = (page - 1) * limit;
    const totalDocument = await getTotalDocument({...filter})
    const pagination = paginationHelper(page, limit,totalDocument)
    const selectFields = req.query.only as string;
    const products = await getAllProductsByQuery({filter, limit, skip, sort, selectFields}) 
    res.json({products, pagination})
})
//[PATCH] "/api/products/:id"
export const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const body = req.body
    const product = await updateProductById(id,body);
    res.status(200).json({product})
})