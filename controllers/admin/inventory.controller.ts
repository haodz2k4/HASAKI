import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import inventoryModel from "../../models/inventory.model";
import paginationHelper from "../../helpers/pagination.helper";
import productModel from "../../models/product.model";
import supplierModel from "../../models/supplier.model";
import rangeCountHelper from "../../helpers/range-count";

//[GET] "/admin/inventories"
export const inventory = catchAsync(async (req: Request, res: Response) => {
    const filter: Record<string, unknown> = {
        deleted: false
    }
    
    const minQuantity = parseInt(req.query.minQuantity as string) || 0;
    const maxQuantity = parseInt(req.query.maxQuantity as string);
    filter["$and"] = rangeCountHelper('quantity',minQuantity, maxQuantity)
    const keyword = req.query.keyword as string;
    if (keyword) {
        filter["$or"] = [
            { "product.title": new RegExp(keyword, "i") },
            { "supplier.name": new RegExp(keyword, "i") },
            { wareHouse: new RegExp(keyword,"i")},
        ]
    }  
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const aggregatePipeline = [
        {
            $lookup: {
                from: 'products',
                foreignField: '_id',
                localField: 'productId',
                as: 'product'
            }
        },
        {
            $lookup: {
                from: 'suppliers',
                foreignField: '_id',
                localField: 'supplierId',
                as: 'supplier'
            }
        },
        { $unwind: '$product' },
        { $unwind: '$supplier' },
        { $match: filter },
        {
            $facet: {
                totalCount: [{ $count: "count" }], 
                data: [ 
                    { $skip: skip },
                    { $limit: limit }
                ]
            }
        }
    ];

    const result = await inventoryModel.aggregate(aggregatePipeline);

    const inventories = result[0].data;
    const totalDocuments = result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;

    const pagination = paginationHelper(page, limit, totalDocuments);

    res.render("admin/pages/inventories/inventory.pug", {
        inventories,
        activePages: 'inventories',
        pageTitle: 'Quản lý kho hàng',
        pagination,
        keyword,
        minQuantity,
        maxQuantity
    });
});


//[GET] "/admin/inventories/create"
export const create = catchAsync(async (req: Request, res: Response) => {
    const products = await productModel.find({deleted: false, status: "active"})
    const suppliers = await supplierModel.find({deleted: false, status: "active"})
    res.render("admin/pages/inventories/create.pug", {
        products,
        suppliers,
        activePages: 'inventories'
    });
}) 

//[POST] "/admin/inventories"
export const createPost = catchAsync(async (req: Request, res: Response) => {
    const body = req.body
    await inventoryModel.create(body)
    req.flash('success','Thêm đơn hàng thành công')
    res.redirect("/admin/inventories")
})