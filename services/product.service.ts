import { IProduct } from './../models/product.model';
import { IProductRepository, IProductQuery } from "../repository/product.repository"

export interface IProductService {
    getProducts(productQuery: Partial<IProductQuery>): any
}
export class ProductService implements IProductService  {
    constructor(private productRepository: IProductRepository) {}

    async getProducts(productQuery: Partial<IProductQuery>){
        return await this.productRepository.findAll(productQuery);
    }
    
}