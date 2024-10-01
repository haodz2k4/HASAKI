import { IProduct } from './../models/product.model';
import { IProductRepository, IProductQuery } from "../repository/product.repository"
import { CacheService } from './cache.service';

export interface IProductService {
    getProducts(productQuery: IProductQuery): Promise<IProduct[]>;
    getTotalDocument(filter?: Record<string, any>): Promise<number>;
    getProductBySlug(slug: string): Promise<IProduct | null>;
}
export class ProductService implements IProductService  {
    constructor(private productRepository: IProductRepository,private cacheService: CacheService) {}
    async getProductBySlug(slug: string): Promise<IProduct | null> {
        this.cacheService.setCacheKey(`:slug:${JSON.stringify(slug)}`) 
        const cached = await this.cacheService.getCache();
        if(cached){
           return cached 
        }
        
        const product = await this.productRepository.getProductBySlug(slug)
        await this.cacheService.setCache(7200,product)
        return product
    }

    async getProducts(productQuery: IProductQuery){
        this.cacheService.setCacheKey(`:${JSON.stringify(productQuery)}`) 
        const cached = await this.cacheService.getCache();
        if(cached){
           return cached 
        }
        
        const products = await this.productRepository.findAll(productQuery);
        await this.cacheService.setCache(7200,products)
        return products
    }
    
    async getTotalDocument(filter?: Record<string, any>): Promise<number> {
       return this.productRepository.getTotalDocument(filter);
    }
}