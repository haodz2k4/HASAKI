import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import * as categoryService from "../services/category.service"
import pick from "../utils/pick";
import { sortType } from "../utils/types/sort";
import { ApiError } from "../utils/error";

//[GET] "/api/categories"
export const getCategories = catchAsync(async (req: Request, res: Response) => {

    const query = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.page as string) || 10,
        filter: pick(req.query, ["status", "keyword", "searchBy"]) as Record<string, unknown>,
        sortKey: req.query.sortKey as string,
        sortValue: req.query.sortValue as sortType,
        selectFields: req.query.selectFields as string
    };
    const record = await categoryService.getCategories(query)
    res.json(record)

}) 

//[POST] "/api/categories"
export const createCategory = catchAsync(async (req: Request, res: Response) => {
    const body = req.body
    const category = await categoryService.createCategory(body);
    res.json(category)
})

//[GET] "/api/categories/:id"
export const getCategoryById = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params
    const category = await categoryService.getCategoryById(id)
    if(!category){
        throw new ApiError(404,"Category is not found")
    }
    res.json(category)
}) 

//[PATCH] "/api/categories/:id"
export const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params
    const body = req.body
    const category = await categoryService.updateCategory(id,body);
    res.json(category)
})

//[DELETE] "/api/categories/:id"
export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    await categoryService.deleteCategory(id);
    res.status(204)
}) 

//[GET] "/api/categories/slug/:slug"
export const getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
    const {slug} = req.params;
    const category = await categoryService.getCategoryBySlug(slug);
    if(!category){
        throw new ApiError(404,"Category is not found")
    }
    res.json(category)

})