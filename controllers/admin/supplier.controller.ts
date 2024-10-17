import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import supplierModel from "../../models/supplier.model";
import paginationHelper from "../../helpers/pagination.helper";

//[GET] "/admin/suppliers"
export const suppliers = catchAsync(async (req: Request, res: Response) => {
    const filter: Record<string, unknown> = {deleted: false}

    const keyword = req.query.keyword as string;
    if(keyword){
        const searchBy = req.query.searchBy as string;
        if(searchBy){
            filter[searchBy] = new RegExp(keyword,"i")
        }else{
            filter.name = new RegExp(keyword,"i")
        }
    }
    //Pagination 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    const [suppliers, total] = await Promise.all([
        supplierModel
            .find(filter)
            .skip(skip)
            .limit(limit),
        supplierModel.countDocuments(filter)
    ])
    const pagination = paginationHelper(page, limit, total)
    
    res.render("admin/pages/suppliers/supplier.pug",{
        suppliers,
        pagination,
        pageTitle: "Nhà cung cấp",
        activePages: "suppliers"
    })
})