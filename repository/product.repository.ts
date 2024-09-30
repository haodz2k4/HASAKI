import { PaginationResult } from "../helpers/pagination.helper";
import { IProduct } from "../models/product.model";
import ProductModel from "../models/product.model";
export interface IProductQuery {
    pagination: PaginationResult;
    filter?: Record<string, any>;
    sortKey?: keyof IProduct;
    sortBy?: "asc" | "desc"
}
export interface IProductRepository {
    findAll(productQuery: IProductQuery): Promise<IProduct[]>;
    getTotalDocument(filter?: Record<string, any>):Promise<number>;
}

export class ProductRepository implements IProductRepository {
    async findAll(productQuery: IProductQuery): Promise<IProduct[]> {
        const {pagination,filter, sortKey = "position", sortBy = "desc"} = productQuery;
        const {limit , skip = 0} = pagination;
        return await ProductModel
        .find({...filter, deleted: false})
        .sort({[sortKey]: sortBy})
        .skip(skip)
        .limit(limit)
    }
    
    async getTotalDocument(filter?: Record<string, any>) :Promise<number> {
        return await await ProductModel.countDocuments(filter)
    }
}
