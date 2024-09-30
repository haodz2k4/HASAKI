import { IProductService } from "../../services/product.service";
import { Request, Response, NextFunction } from "express";

//[GET] "/products"
export class ProductController {
    constructor(private productService: IProductService) {}

    async getProducts(req: Request, res: Response) {
        
        res.render("clients/pages/products/product.pug",{
            products: await this.productService.getProducts({})
        })
    }
}