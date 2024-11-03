import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import orderModel from "../../models/order.model";
import paginationHelper from "../../helpers/pagination.helper";

//[GET] "/admin/orders"
export const order = catchAsync(async (req: Request, res: Response) => {
    
    const filter: Record<string, any> = {deleted: false}
    const keyword = req.query.keyword as string;
    if(keyword){
        if (keyword) {
            filter["$or"] = [
                {["user.fullName"]: new RegExp(keyword,"i")},
                {["user.email"]: new RegExp(keyword,"i")},
                {["user.phone"]: new RegExp(keyword,"i")}
            ]
        }
    }
    //Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const total  = await orderModel.countDocuments();
    const pagination = paginationHelper(page, limit, total) 

    //sort 
    const sortKey = req.query.sortKey as string || 'createdAt' 
    const sortValue = (req.query.sortValue as  string === 'asc') ? 1 : -1
    const sort: Record<string, 1 | -1> = {[sortKey]: sortValue}

    const orders = await orderModel.aggregate([

        {
            $lookup: {
                from: "users",
                localField: "user.userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {$unwind: "$user"},
        { $match: filter},
        {
            $project: {
                status: 1,
                paymentMethod: 1,
                user: 1,
                shippingCost: 1,
                products: 1
            }
        },
        {
            $skip: pagination.skip
        },
        {
            $limit: limit
        },
        {
            $sort: sort
        },
        {
            $addFields: {
                totalPrice: {
                    $sum: {
                        $map: {
                            input: "$products",
                            as: "product",
                            in: { $multiply: ["$$product.price", "$$product.quantity"] },
                        },
                    },
                },
            },
        }
    ])
    res.render("admin/pages/orders/order.pug",{
        orders,
        activePages: 'orders',
        pagination,
        keyword
    })
})