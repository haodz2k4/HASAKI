import { Request, Response } from "express"
import { getAllProductsByQuery, getTotalDocument } from "../../services/product.service"
import pick from "../../utils/pick"
import paginationHelper from "../../helpers/pagination.helper"
import rangePriceHelper from "../../helpers/range-price.helper"
//[GET] "/api/products"
export const getProducts = async (req: Request, res: Response) => {
    
    const query = pick(req.query,["status", "highlighted"]);
    const filter: Record<string, any> = {...query}
    
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
    res.json({items: products, pagination})
}