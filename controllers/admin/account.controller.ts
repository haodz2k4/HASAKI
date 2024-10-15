import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import accountModel from "../../models/account.model";
import roleModel from "../../models/role.model";
import paginationHelper from "../../helpers/pagination.helper";
import { RenderError } from "../../utils/error";
import filterHelper from "../../helpers/filter.helper";

//[GET] "/admin/accounts"
export const accounts = catchAsync(async (req: Request, res: Response) => {

    const filters = filterHelper([]);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    const [accounts, total] = await Promise.all([
        accountModel
            .find({deleted: false})
            .limit(limit)
            .skip(skip),
        accountModel.countDocuments({deleted: false})
    ])
    const pagination = paginationHelper(page, limit, total);

    const roles = await roleModel.find({deleted: false});
    res.render("admin/pages/accounts/account.pug",{
        pageTitle: "Quản lý tài khoản",
        activePages: "accounts",
        accounts,
        pagination,
        roles,
        filters
    })
})

//[GET] "/admin/accounts/create"
export const create = catchAsync(async (req: Request, res: Response) => {
    const roles = await roleModel.find({deleted: false})
    res.render("admin/pages/accounts/create.pug",{
        pageTitle: "Thêm tài khoản",
        activePages: "accounts",
        roles
    })
})

//[POST] "/admin/accounts/create"
export const createPost = catchAsync(async  (req: Request, res: Response) => {
    const body = req.body;
    await accountModel.create(body);
    res.redirect("/admin/accounts");
}) 

//[GET] "/admin/accounts/update/:id"
export const update = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params
    const account = await accountModel.findOne({_id: id, deleted: false})
    if(!account){
        throw new RenderError(404,"Account is not found")
    }
    const roles = await roleModel.find({
        deleted: false
    })
    res.render("admin/pages/accounts/update.pug",{
        activePages: 'accounts',
        pageTitle: 'Cập nhật tài khoản',
        account,
        roles
    })
})

//[PATCH] "/admin/accounts/update/:id"
export const updatePatch = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const body = req.body;
    await accountModel.findOneAndUpdate({_id: id, deleted: false},body);
    res.redirect("/admin/accounts")
}) 

//[GET] "/admin/accounts/detail/:id"
export const detail = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params 
    const account = await accountModel.findOne({_id: id})
    if(!account){
        throw new RenderError(404,"Account is not found")
    }
    res.render("admin/pages/accounts/detail.pug",{
        activePages: 'accounts',
        pageTitle: account.fullName,
        account,
    })
})