import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import orderModel from "../../models/order.model";
import paginationHelper from "../../helpers/pagination.helper";
import { io } from "../..";
//[GET] "/admin/orders"
export const order = catchAsync(async (req: Request, res: Response) => {
    
    const filter: Record<string, any> = {deleted: false}

    const status = req.query.status as string;
    if(status){
        filter.status = status
    }

    const keyword = req.query.keyword as string;
    if(keyword){
        if (keyword) {
            filter["$or"] = [
                {"user.fullName": new RegExp(keyword,"i")},
                {"user.email": new RegExp(keyword,"i")},
                {"user.phone": new RegExp(keyword,"i")}
            ]
        }
    }
    //Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const total  = await orderModel.countDocuments(filter);
    const pagination = paginationHelper(page, limit, total) 

    //sort 
    const sortKey = req.query.sortKey as string || 'createdAt' 
    const sortValue = (req.query.sortValue as  string === 'asc') ? 1 : -1
    const sort: Record<string, 1 | -1> = {[sortKey]: sortValue}
    console.log(sort)
    const sortString = `${sortKey}-${req.query.sortValue}`
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
                products: 1,
                id: 1,
                isConfirmed: 1,
                createdAt: 1,
                updatedAt: 1
            }
        },
        {
            $skip: pagination.skip
        },
        {
            $limit: limit
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
                productCount: {$size: "$products"}
            },
        },
        {
            $sort: sort
        }
    ])
    
    io.on('connection', (socket) => {
        console.log('A user connected');
        
        socket.on('UPDATE_STATUS_ORDER', async (msg) => {
            const { id, status } = msg;
            await orderModel.updateOne({ _id: id }, { status });
            
            io.to("users").emit('UPDATE_STATUS_SUCCESS', status);
        });
        
        socket.on('UPDATE_CONFIRM_ORDER', (msg) => {
            io.to("users").emit('ORDER_CONFIRMATION_UPDATE', { redirectUrl: req.get("Referrer") || "/" });
        })
        socket.on('joinRoom', (room) => {
            socket.join(room);
            socket.emit('joinRoom',room)
        });
    
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
    res.render("admin/pages/orders/order.pug",{
        orders,
        activePages: 'orders',
        pagination,
        keyword,
        sortString,
        status
    })
})

//[GET] "/admin/orders/detail/:id"
export const getOrder = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const order = await orderModel.findOne({_id: id, deleted: false}).populate('products.productId');
    res.render("admin/pages/orders/detail.pug",{
        order,
        activePages: 'orders'
    })
})