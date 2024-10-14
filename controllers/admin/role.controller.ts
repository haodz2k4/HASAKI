import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import roleModel from "../../models/role.model";
import paginationHelper from "../../helpers/pagination.helper";
import { rangeSize } from "../../helpers/range-count";

//[GET] "/admin/roles"
export const roles = catchAsync(async (req: Request, res: Response) => {
    
    //Filter 
    const filter: Record<string, unknown> = {deleted: false}
    
    const keyword = req.query.keyword as string;
    if(keyword){
        filter.title = new RegExp(keyword);
    }
    //Range Count Permissions
    const minCountPermission = parseInt(req.query.minCountPermission as string)
    const maxCountPermission = parseInt(req.query.maxCountPermission as string);
    const size = rangeSize('permissions',minCountPermission, maxCountPermission)
    if(size.length > 0){
        filter.$and = size
    }
    //Pagination 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const [roles, total] = await Promise.all([
        roleModel
        .find(filter)
        .skip(skip)
        .limit(limit),
        roleModel.countDocuments(filter)
    ])
    const pagination = paginationHelper(page, limit,total)
    res.render("admin/pages/roles/role.pug",{
        pageTitle: "Quản lý nhóm quyền",
        activePages: "roles",
        roles,
        pagination,
        keyword,
        minCountPermission,
        maxCountPermission
        
    })
})