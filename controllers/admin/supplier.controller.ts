import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import supplierModel from "../../models/supplier.model";
import paginationHelper from "../../helpers/pagination.helper";

//[GET] "/admin/suppliers"
export const suppliers = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    const [suppliers, total] = await Promise.all([
        supplierModel
            .find({deleted: false})
            .skip(skip)
            .limit(limit),
        supplierModel.countDocuments({deleted: false})
    ])
    const pagination = paginationHelper(page, limit, total)
    res.render("admin/pages/suppliers/supplier.pug",{
        suppliers,
        pagination,
        pageTitle: "Nhà cung cấp",
        activePages: "suppliers"
    })
})