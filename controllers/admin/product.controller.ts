import { Request, Response } from "express";
import paginationHelper from "../../helpers/pagination.helper";
import filterHelper from "../../helpers/filter.helper";
import productModel from "../../models/product.model";
import { catchAsync } from "../../utils/catchAsync";
import categoryModel from "../../models/category.model";
import { RenderError } from "../../utils/error";
//[GET] "/admin/products"
export const products = catchAsync(async (req: Request, res: Response) => {
    
    const keyword = req.query.keyword as string 
    const filter: Record<string, unknown> = {deleted: false}
    if(keyword){
        console.log(keyword)
        filter.title = new RegExp(keyword,"i") 
    }
    const minPrice = req.query.minPrice as string;
    const maxPrice = req.query.maxPrice as string;
    const rangePrices: Record<string,unknown>[] = [];
    if(minPrice){
        rangePrices.push({
            price: {$gte: minPrice}
        })
    }
    if(maxPrice){
        rangePrices.push({
            price: {$lte: maxPrice}
        })
    }
    filter.$and = rangePrices
    
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
    const categories = await categoryModel.find({deleted: false});
    res.render("admin/pages/products/product.pug",{
        pageTitle: "Quản lý sản phẩm",
        activePages: "products",
        products,
        pagination,
        keyword,
        filters,
        sortString,
        minPrice,
        maxPrice,
        categories
    })
})

//[PATCH] "/admin/products/change-multi"
export const changeMulti = catchAsync(async (req: Request, res: Response) => {
    
    const {ids, data} = JSON.parse(req.body.result)
    const [key, value] = data.split("-");
    const infoUpdate = await productModel.updateMany({_id: {$in: ids}},{[key]: value});
    if(infoUpdate.modifiedCount > 0){
        req.flash("error","Không thể cập nhật hết sản phẩm")
    }
    res.redirect("back")
})

//[GET] "/admin/products/create"
export const create = catchAsync(async (req: Request, res: Response) => {
    const categories = await categoryModel.find({deleted: false}).limit(10)
    res.render("admin/pages/products/create.pug",{
        pageTitle: "Thêm sản phẩm",
        activePages: "products",
        partialPage: "Thêm",
        categories
    })
})

//[POST] "/admin/products/create"
export const createPost = catchAsync(async (req: Request, res: Response) => {
    const body = req.body;
    await productModel.create(body);
    req.flash('successs','Tạo sản phẩm mới thành công')
    res.redirect("/admin/products")
})

//[GET] "/admin/products/update/:id"
export const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const categories = await categoryModel.find({deleted: false})
    const {id} = req.params;
    const product = await productModel.findOne({_id: id, deleted: false})
    if(!product){
        throw new RenderError(404,"Product is not found")
    }
    res.render("admin/pages/products/update.pug",{
        pageTitle: "Thêm sản phẩm",
        activePages: "products",
        partialPage: "Sửa",
        categories,
        product
    })
})

//[PATCH] "/admin/products/update/:id"
export const updateProductPatch = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const body = req.body;
    const product = await productModel.findOne({_id: id, deleted: false});
    if(!product){
        throw new RenderError(404,"Product is not found")
    }
    Object.assign(product,body);
    await product.save();
    res.redirect("/admin/products");
})