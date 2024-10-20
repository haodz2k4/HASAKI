import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import * as categoryService from "../services/category.service"
import pick from "../utils/pick";
import { sortType } from "../utils/types/sort";

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