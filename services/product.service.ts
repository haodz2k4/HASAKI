import { Model } from "mongoose";
import ProductModel, {IProduct} from "../models/product.model";

export interface IProductService {
    getProducts(): Promise<IProduct[]>
}
export class ProductService implements IProductService  {
    constructor(private productModel: Model<IProduct> = ProductModel) {}

    async getProducts(): Promise<IProduct[]>{
        return await this.productModel.find()
    }
    
}