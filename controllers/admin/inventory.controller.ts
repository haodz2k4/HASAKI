import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import inventoryModel from "../../models/inventory.model";

//[GET] "/admin/inventories"
export const inventory = catchAsync(async (req: Request, res: Response) => {
    const inventories = await inventoryModel.find({deleted: false})
    res.render("admin/pages/inventories/inventory.pug",{
        inventories,
        activePages: 'inventories',
        pageTitle: 'Quản lý kho hàng'
    })
})