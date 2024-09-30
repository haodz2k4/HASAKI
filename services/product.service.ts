import { IProduct } from './../models/product.model';
import { IProductRepository, IProductQuery } from "../repository/product.repository"

export interface IProductService {
    getProducts(productQuery: Partial<IProductQuery>): Promise<IProduct[]>
}
export class ProductService implements IProductService  {
    constructor(private productRepository: IProductRepository) {}

    async getProducts(productQuery: Partial<IProductQuery>): Promise<IProduct[]>{
        return await this.productRepository.findAll(productQuery);
    }
    
}