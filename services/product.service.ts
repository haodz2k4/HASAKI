import { IProduct } from './../models/product.model';
import { IProductRepository, IProductQuery } from "../repository/product.repository"

export interface IProductService {
    getProducts(productQuery: IProductQuery): Promise<IProduct[]>;
    getTotalDocument(filter?: Record<string, any>): Promise<number>;
    getProductBySlug(slug: string): Promise<IProduct | null>;
}
export class ProductService implements IProductService  {
    constructor(private productRepository: IProductRepository) {}
    async getProductBySlug(slug: string): Promise<IProduct | null> {
        const product = await this.productRepository.getProductBySlug(slug)

        return product
    }

    async getProducts(productQuery: IProductQuery){
        return await this.productRepository.findAll(productQuery);
    }
    
    async getTotalDocument(filter?: Record<string, any>): Promise<number> {
       return this.productRepository.getTotalDocument(filter);
    }
}