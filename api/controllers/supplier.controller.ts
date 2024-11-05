import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import * as supplierService from "../services/supplier.service"
import { sortType } from "../utils/types/sort";

//[GET] "/api/suppliers"
export const getSuppliers = catchAsync(async (req: Request, res: Response) => {

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const selectFields = req.query.selectFields as string;

    const sortKey = req.query.sortKey as string;
    const sortValue = req.query.sortValue as sortType;

    const keyword = req.query.keyword as string 
    const status = req.query.status as string
    const records = await supplierService.getSuppliers(
        {
            page,
            limit,
            selectFields,
            sortKey, 
            sortValue, 
            filter: {
                keyword,
                status
            }
        }
    )
    res.json(records)
})