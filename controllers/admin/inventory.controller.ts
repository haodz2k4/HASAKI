import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import inventoryModel from "../../models/inventory.model";
import paginationHelper from "../../helpers/pagination.helper";

//[GET] "/admin/inventories"
export const inventory = catchAsync(async (req: Request, res: Response) => {

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    const [inventories, total] = await Promise.all([
        inventoryModel
        .find({deleted: false})
        .skip(skip)
        .populate('productId','title')
        .populate('supplierId','name'),
        inventoryModel.countDocuments({deleted: false})
    ])
    const pagination = paginationHelper(page, limit, total)
    res.render("admin/pages/inventories/inventory.pug",{
        inventories,
        activePages: 'inventories',
        pageTitle: 'Quản lý kho hàng',
        pagination
    })
})