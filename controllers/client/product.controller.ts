import { Request, Response } from "express";
import paginationHelper from "../../helpers/pagination.helper";
import rangeCount from "../../helpers/range-count";
import productModel from "../../models/product.model";
import { catchAsync } from "../../utils/catchAsync";
import { RenderError } from "../../utils/error";
import orderModel from "../../models/order.model";
import productReviewModel from "../../models/product-review.model";
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
    const minPrice = parseInt(req.query.minPrice as string) || 0
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
    const productReviews = await productReviewModel.find({productId: product.id}).populate('userId','fullName');
    res.render("clients/pages/products/detail.pug", {
        product,
        isFaforiteList,
        productReviews
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

//[POST] "/products/:id/product-reviews"
export const addProductReview = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    console.log(req.body)
    const product = await productModel.findOne({_id: id});
    if(!product){
        throw new RenderError(404,"Product is not found");
    }
    const user = res.locals.user; 
    const countProductReview = await productReviewModel.countDocuments({productId: id});
    const countOrder = await orderModel.countDocuments({'user.userId': user.id});
    if(countOrder === 0 || countOrder <= countProductReview){
        throw new RenderError(400,"Bạn không thể đánh giá sản phẩm");
    }
    const {rating, comment, orderId} = req.body;
    
    await productReviewModel.create({
        userId: user.id, 
        productId: id,
        rating,
        comment,
        orderId
    })
    req.flash('success','Thêm đánh giá sản phẩm thành công')
    res.redirect("back");

})