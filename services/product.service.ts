import { IProduct } from './../models/product.model';
import { IProductRepository } from "../repository/product.repository"

export interface IProductService {
    getProducts(): Promise<IProduct[]>
}
export class ProductService implements IProductService  {
    constructor(private productRepository: IProductRepository) {}

    async getProducts(): Promise<IProduct[]>{
        return await this.productRepository.findAll({});
    }
    
}