import { Request, Response } from "express";
import paginationHelper from "../../helpers/pagination.helper";
import rangeCount from "../../helpers/range-count";
import productModel from "../../models/product.model";
import { catchAsync } from "../../utils/catchAsync";
import { RenderError } from "../../utils/error";
import orderModel from "../../models/order.model";
//[GET] "/products"
export const products = catchAsync(async (req: Request, res: Response) => {
    
    const filter: Record<string, any> = {status: "active", deleted: false}
    
    //Sort
    const sortKey = req.query.sortKey as string;
    const sortValue = req.query.sortValue as "asc" | "desc";
    const sort: Record<string, "asc" | "desc"> = {}
    if(sortKey && sortValue) {
        sort[sortKey] = sortValue
    }
    const sortString = `${sortKey}-${sortValue}`;
    //range price 
    const minPrice = parseInt(req.query.minPrice as string)
    const maxPrice = parseInt(req.query.maxPrice as string);
    
    filter.$and = rangeCount('price',minPrice, maxPrice)
    //Search 
    const keyword = req.query.keyword as string;
    if(keyword){
        filter.title = new RegExp(keyword,"i")
    }
    //Pagination 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 16
    const skip = (page - 1) * limit;
    const [products, totalDocument] =await Promise.all([
        productModel
            .find(filter)
            .skip(skip)
            .limit(limit)
            .sort({position: 'desc'}),
        productModel.countDocuments(filter)
    ])
    const pagination = paginationHelper(page, limit,totalDocument)
    
    res.render("clients/pages/products/product.pug",{
        products,
        pagination,
        sortString,
        minPrice,
        maxPrice,
        keyword,
        
    })
})
//[GET] "/products/:slug"
export const detail = catchAsync(async (req: Request, res: Response) => {
    const {slug} = req.params;
    
    const product = await productModel.findOne({slug, deleted: false})
    if(!product){
        throw new RenderError(404,"Product is not found ")
    }
    const favoriteList = res.locals.favoriteList 

    const isFaforiteList = favoriteList ? favoriteList.productIds.some((item: Record<string, any>) => item.id === product.id) : false

    res.render("clients/pages/products/detail.pug", {
        product,
        isFaforiteList
    })
})


//[PATCH] "/products/favorite-list/toggle/:id"
export const toggleFavoriteList = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const favoriteList = res.locals.favoriteList;
    await favoriteList.toggleFavoriteList(id);
    await favoriteList.save()
    req.flash('success','Thay đổi danh sách yêu thích thành công')
    res.redirect("back");
}) 