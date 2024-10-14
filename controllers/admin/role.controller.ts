import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import roleModel from "../../models/role.model";
import paginationHelper from "../../helpers/pagination.helper";
import { rangeSize } from "../../helpers/range-count";
import { RenderError } from "../../utils/error";

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

//[GET] "/admin/roles/create"
export const create = catchAsync(async (req: Request, res: Response) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Thêm Nhóm quyền",
        activePages: 'roles',
    })
})

//[POST] "/admin/roles/create"
export const createPost = catchAsync(async (req: Request, res: Response) => {
    const body = req.body;
    await roleModel.create(body);
    res.redirect("/admin/roles")
})

//[GET] "/admin/roles/update/:id"
export const update = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const role = await roleModel.findOne({
        _id: id,
        deleted: false
    })
    if(!role){
        throw new RenderError(404,"Role is not found")
    }
    res.render("admin/pages/roles/update.pug",{
        role
    })
})

//[PATCH] "/admin/roles/update/:id"
export const updatePatch = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const body = req.body
    const role = await roleModel.findOneAndUpdate({_id: id, deleted: false},body);
    if(!role){
        throw new RenderError(404,"Role is not found");
    }
    res.redirect("/admin/roles")
})