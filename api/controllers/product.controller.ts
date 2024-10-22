import { Request, Response } from 'express';
import { catchAsync } from "../utils/catchAsync";
import * as productService from "../services/product.service";
import pick from '../utils/pick';
import { sortType } from '../utils/types/sort';
import { IProduct } from '../../models/product.model';
import { ApiError } from '../utils/error';

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter products by status
 *       - in: query
 *         name: highlighted
 *         schema:
 *           type: string
 *           enum: [1, 0]
 *         description: Filter products that are highlighted
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter products by category ID
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Filter products by keyword
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of products per page
 *       - in: query
 *         name: sortKey
 *         schema:
 *           type: string
 *         description: Field to sort the results by
 *       - in: query
 *         name: sortValue
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction (ascending or descending)
 *       - in: query
 *         name: only
 *         schema:
 *           type: string
 *         description: Fields to return (comma-separated)
 *     responses:
 *       200:
 *         description: Successfully retrieved list of products
 *       400:
 *         description: Bad request
 */
export const getProducts = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query,["status", "highlighted","categoryId","keyword","minPrice","maxPrice"]);
    //Pagination 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    //sorting 
    const sortKey = req.query.sortKey as keyof IProduct
    const sortValue = req.query.sortValue as sortType;

    const only = req.query.only as string || ""
    const products = await productService.getProducts({
        filter, 
        page, 
        limit,
        sortKey,
        sortValue,
        selectFields: only
    })
    res.json(products)
})

/**
 * @swagger 
 * /api/products: 
 *   post: 
 *      summary: Create product
 *  
 * 
 */
export const createProduct = catchAsync(async (req: Request, res: Response) => {
    const body = req.body;
    const product = await productService.createProduct(body);
    res.status(201).json({message: "Create Product successfully",product})
})
/**
 * @swagger
 * /api/products/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the product
 *     responses:
 *       200:
 *         description: Successfully retrieved the product by slug
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 *       404:
 *         description: Product not found
 */
export const getProductBySlug = catchAsync(async (req: Request, res: Response) => {
    const {slug} = req.params;
    const product = await productService.getProductBySlug(slug);
    res.json({product})
})

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Successfully retrieved the product by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 *       404:
 *         description: Product not found
 */
export const getProductById = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const product = await productService.findProductById(id);
    if(!product){
        throw new ApiError(404,"Product is not found");
    }
    res.json({product});
})

/**
 * @swagger
 * /api/products/{id}/upload:
 *   post:
 *     summary: Upload files for a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Successfully uploaded files and updated product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *       400:
 *         description: Files must be provided
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: object
 *                 description: Product data to update
 *     responses:
 *       200:
 *         description: Successfully updated the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 */
export const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const body = req.body;
    const product = await productService.updateProductById(id, body);
    res.status(200).json({message: "Update product successfully",product})
})

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       204:
 *         description: Successfully deleted the product
 *       404:
 *         description: Product not found
 */
export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    await productService.deleteProduct(id);
    res.status(204)
})
