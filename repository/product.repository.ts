import { IProduct } from "../models/product.model";
import ProductModel from "../models/product.model";
export interface IProductRepository {
    findAll(): Promise<IProduct[]>;
}

export class ProductRepository implements IProductRepository {
    async findAll(): Promise<IProduct[]> {
        return await ProductModel.find();
    }
}
