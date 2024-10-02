import { Request, Response } from "express";
import { getAllProductsByQuery, getProductBySlug, getTotalDocument } from "../../services/product.service";
import paginationHelper from "../../helpers/pagination.helper";
import rangePriceHelper from "../../helpers/range-price.helper";
//[GET] "/products"
export const products = async (req: Request, res: Response) => {
    
    const filter: Record<string, any> = {status: "active"}
    
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
    
    filter.$and = rangePriceHelper(minPrice, maxPrice)
    //Search 
    const keyword = req.query.keyword as string;
    if(keyword){
        filter.keyword = keyword
    }
    //Pagination 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20 
    const skip = (page - 1) * limit;
    const totalDocument = await getTotalDocument({...filter})
    const pagination = paginationHelper(page, limit,totalDocument)
    const products = await getAllProductsByQuery({filter, limit, skip, sort}) 
    res.render("clients/pages/products/product.pug",{
        products,
        pagination,
        sortString,
        minPrice,
        maxPrice,
        keyword
        
    })
}
//[GET] "/products/:slug"
export const detail = async (req: Request, res: Response) => {
    const {slug} = req.params;
    
    const product = await getProductBySlug(slug)
    res.render("clients/pages/products/detail.pug", {product})
}