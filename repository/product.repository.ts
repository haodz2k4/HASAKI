import { IProduct } from "../models/product.model";
import ProductModel from "../models/product.model";
export interface IProductQuery {
    page: number;
    limit: number;
    filter: Record<string, any>,
    sortKey: keyof IProduct,
    sortBy: "asc" | "desc"
}
export interface IProductRepository {
    findAll(productQuery: Partial<IProductQuery>): Promise<IProduct[]>;
}

export class ProductRepository implements IProductRepository {
    async findAll(productQuery: Partial<IProductQuery>): Promise<IProduct[]> {
        const {page = 1, limit = 25, filter, sortKey = "position", sortBy = "desc"} = productQuery

        const skip = (page - 1) * limit 
        return await ProductModel
        .find({...filter, deleted: false})
        .sort({[sortKey]: sortBy})
        .skip(skip)
        .limit(limit)
        

    }
}
