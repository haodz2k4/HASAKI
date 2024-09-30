import { PaginationResult } from "../helpers/pagination.helper";
import { IProduct } from "../models/product.model";
import ProductModel from "../models/product.model";
export interface IProductQuery {
    pagination: PaginationResult;
    filter?: Record<string, any>;
    sortKey?: string;
    sortValue?: "asc" | "desc"
}
export interface IProductRepository {
    findAll(productQuery: IProductQuery): Promise<IProduct[]>;
    getTotalDocument(filter?: Record<string, any>):Promise<number>;
}

export class ProductRepository implements IProductRepository {
    async findAll(productQuery: IProductQuery): Promise<IProduct[]> {
        const {pagination,filter, sortKey = "position", sortValue = "desc"} = productQuery;
        const {limit , skip = 0} = pagination;
        return await ProductModel
        .find({...filter, deleted: false})
        .sort({[sortKey]: sortValue})
        .skip(skip)
        .limit(limit)
    }
    
    async getTotalDocument(filter?: Record<string, any>) :Promise<number> {
        return await await ProductModel.countDocuments(filter)
    }
}
