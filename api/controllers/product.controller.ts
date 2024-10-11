import { Request, Response } from 'express';
import { catchAsync } from "../utils/catchAsync";
import * as productService from "../services/product.service";
import pick from '../utils/pick';
import { sortType } from '../utils/types/sort';
import { IProduct } from '../../models/product.model';
import { ApiError } from '../utils/error';

/** 
 * @swagger
 * /api/products  
*/
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

//[POST] "/api/products"
export const createProduct = catchAsync(async (req: Request, res: Response) => {
    const body = req.body;
    const product = await productService.createProduct(body);
    res.status(201).json({message: "Create Product successfully",product})
})

//[GET] "/api/products/:id"
export const getProductById = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const product = await productService.findProductById(id);
    if(!product){
        throw new ApiError(404,"Product is not found");
    }
    res.json({product});
})

//[POST] "/api/products/:id/upload"
export const uploadFile = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const files = req.files;
    if (files && Array.isArray(files) && files.length > 0) {
        const urls: string[] = files.map(item => item.path);
        const product = await productService.updateProductById(id,{thumbnail: urls});
        res.status(200).json({message: "upload File successfully", product})
    }else {
        throw new ApiError(400,"Files is must provided")
    }
    
})

//[PATCH] "/api/products/:id"
export const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const body = req.body;
    const product = await productService.updateProductById(id, body);
    res.status(200).json({message: "Update product successfully",product})
})

//[DELETE] "/api/products/:id"
export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    await productService.deleteProduct(id);
    res.status(204)
})
