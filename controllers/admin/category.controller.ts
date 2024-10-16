import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import categoryModel from "../../models/category.model";

//[GET] "/admin/category"
export const category = catchAsync(async (req: Request, res: Response) => {
    const categories = await categoryModel.find({deleted: false});
    res.render("admin/pages/categories/category.pug",{
        pageTitle: "Quản lý danh mục",
        categories,
        activePages: 'categories',
    })
})

