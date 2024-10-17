import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import categoryModel from "../../models/category.model";
import paginationHelper from "../../helpers/pagination.helper";
import filterHelper from "../../helpers/filter.helper";
import pick from "../../utils/pick";

//[GET] "/admin/category"
export const category = catchAsync(async (req: Request, res: Response) => {
    //Pagination 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    //Filter 
    const filter: Record<string, unknown> = {deleted: false};
    //Filters 
    const filters = filterHelper([]);
    const status = req.query.status as string;
    if(status){
        filter.status = status;
        const index = filters.findIndex(item => item.name === status);
        filters[index].selected = true 
    }
    //Query 
    const [categories,total] = await Promise.all([
        categoryModel
            .find(filter)
            .skip(skip)
            .limit(limit),
        categoryModel.countDocuments(filter)
    ])
    const pagination = paginationHelper(page, limit, total)
    res.render("admin/pages/categories/category.pug",{
        pageTitle: "Quản lý danh mục",
        categories,
        activePages: 'categories',
        pagination,
        filters
    })
})


