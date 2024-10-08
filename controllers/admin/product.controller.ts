import { Request, Response } from "express";
import paginationHelper from "../../helpers/pagination.helper";
import filterHelper from "../../helpers/filter.helper";
import productModel from "../../models/product.model";
import catchAsync from "../../api/utils/catchAsync";
//[GET] "/admin/products"
export const products = catchAsync(async (req: Request, res: Response) => {
    
    const keyword = req.query.keyword as string 
    const filter: Record<string, unknown> = {deleted: false}
    if(keyword){
        console.log(keyword)
        filter.title = new RegExp(keyword,"i") 
    }
    
    const filters = filterHelper([
        {
            name: "1",
            value: 'highlighted-1',
            selected: false
        },
        {
            name: "0",
            value: 'highlighted-0',
            selected: false
        }
    ])
    
    const status = req.query.status as string 
    if(status as string){
        filter.status = status 
        const index = filters.findIndex((item) => item.name === status)
        filters[index].selected = true 
    }
    
    const highlighted = req.query.highlighted as string;
    if(highlighted){
        filter.highlighted = highlighted  
        const index = filters.findIndex((item) => item.name === highlighted)
        filters[index].selected = true 
    }
    //Pagination 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const totalDocument = await productModel.countDocuments(filter)
    const pagination = paginationHelper(page, limit, totalDocument)
    const {skip} = pagination
    //Sorting 
    const sortKey = req.query.sortKey as string;
    const sortValue = req.query.sortValue as "desc" | "asc";
    const sort: Record<string, "desc" | "asc"> = {}
    if(sortKey && sortValue){
        sort[sortKey] = sortValue
    }else{
        sort.position = 'desc'
    }
    //Sort string;
    const sortString = `${sortKey}-${sortValue}`
    const products = await productModel
        .find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sort)
    res.render("admin/pages/products/product.pug",{
        activePages: "products",
        products,
        pagination,
        keyword,
        filters,
        sortString
    })
})

