import { Request, Response } from "express";
import paginationHelper from "../../helpers/pagination.helper";
import filterHelper from "../../helpers/filter.helper";
import productModel from "../../models/product.model";
import { catchAsync } from "../../utils/catchAsync";
import categoryModel from "../../models/category.model";
import { RenderError } from "../../utils/error";
import excelJs from "exceljs"
//[GET] "/admin/products"
export const products = catchAsync(async (req: Request, res: Response) => {
    
    const keyword = req.query.keyword as string 
    const filter: Record<string, any> = {deleted: false}
    if(keyword){
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
    //Filter by category 
    const categoryId = req.query.categoryId as string;
    if(categoryId){
        filter.categoryId = categoryId
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
    if(status){
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

    //Pagination 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([productModel
        .find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sort),
        productModel.countDocuments(filter)]);
   
    

    const pagination = paginationHelper(page, limit, total)
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
        categories,
        categoryId
    })
})


//[PATCH] "/admin/products/change-multi"
export const changeMulti = catchAsync(async (req: Request, res: Response) => {
    
    const {ids, data} = JSON.parse(req.body.result)
    const [key, value] = data.split("-");
    await productModel.updateMany({_id: {$in: ids}},{[key]: value});
    req.flash('success','Cập nhật nhiều sản phẩm thành công')
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
    req.flash('success','Cập nhật sản phẩm thành công')
    Object.assign(product,body);
    await product.save();
    res.redirect("/admin/products");
})

//[GET] "/admin/products/detail/:id"
export const detail = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const product = await productModel
        .findOne({_id: id, deleted: false})
        .populate('categoryId','title')
        ;
    if(!product){
        throw new RenderError(404,"Product is not found")
    }
    res.render("admin/pages/products/detail.pug",{
        product,
        pageTitle: product.title,
        activePages: "products",
        partialPage: "Chi tiết"
    })
})

//[GET] "/admin/products/export/excel"
export const exportExcel = catchAsync(async (req: Request, res: Response) => {
    
    const ids = JSON.parse(req.body.ids);
    const products = await productModel.find({_id: {$in: ids}});
    const workBook = new excelJs.Workbook();
    const worksheet = workBook.addWorksheet("Products");
    worksheet.columns = [
        { header: "Id", key: "_id", width: 15 },
        { header: "Title", key: "title", width: 20 },
        { header: "CategoryId", key: "categoryId", width: 20 },
        { header: "Description", key: "description", width: 30 },
        { header: "Highlighted", key: "highlighted", width: 20 },
        { header: "Position", key: "position", width: 10 },
        { header: "Thumbnail", key: "thumbnail", width: 30 },
        { header: "Price", key: "price", width: 10 },
        { header: "Discount (%)", key: "discountPercentage", width: 15 },
        { header: "Deleted", key: "deleted", width: 10 },
        { header: "Slug", key: "slug", width: 20 },
        { header: "Status", key: "status", width: 15 },
        { header: "Quantity", key: "quantity", width: 10 },
    ];
    products.forEach((product) => {
        worksheet.addRow({
            _id: product._id,
            title: product.title,
            categoryId: product.categoryId ? product.categoryId.toString() : "",
            description: product.description,
            highlighted: product.highlighted === "1" ? "có" : "0",
            position: product.position,
            thumbnail: product.thumbnail, 
            price: product.price,
            discountPercentage: product.discountPercentage,
            deleted: product.deleted ? "Yes" : "No",
            slug: product.slug,
            status: product.status,
            quantity: product.quantity || 0,
        });
    });
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="products.xlsx"'
    );
    await workBook.xlsx.write(res);
    req.flash('success','Xuất Excel thành công')
    res.redirect("back");
})

//[DELETE] "/admin/products/remove/:id"
export const remove = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const product = await productModel.findOneAndUpdate({_id: id},{deleted: true});
    if(!product){
        throw new RenderError(404,"User is not found")
    }
    req.flash('success','Xóa sản phẩm thành công')
    res.redirect("back")
})