import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import orderModel from "../../models/order.model";
import paginationHelper from "../../helpers/pagination.helper";
import { RenderError } from "../../utils/error";

//[GET] "/admin/orders"
export const order = catchAsync(async (req: Request, res: Response) => {
    
    const filter: Record<string, any> = {deleted: false}
    const keyword = req.query.keyword as string;
    if(keyword){
        if (keyword) {
            filter['$or'] = [
                { 'user.userId.fullName': new RegExp(keyword, "i") },
                { 'user.userId.email': new RegExp(keyword, "i") },
                { 'user.userId.phone': new RegExp(keyword, "i") },
            ];
        }
    }
    //Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const total  = await orderModel.countDocuments();
    const pagination = paginationHelper(page, limit, total) 

    //sort 
    const sortKey = req.query.sortKey as string || 'createdAt' 
    const sortValue = req.query.sortValue as "asc" | "desc"  || 'desc'
    const sort: Record<string, "asc" | "desc"> = {[sortKey]: sortValue}


    const orders = await orderModel.find({deleted: false})
    .populate('user.userId','fullName')
    .sort(sort)
    .skip(pagination.skip)
    .limit(pagination.limit)
    res.render("admin/pages/orders/order.pug",{
        orders,
        activePages: 'orders',
        pagination
    })
})