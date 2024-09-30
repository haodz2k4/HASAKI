import { IProductService } from "../../services/product.service";
import { Request, Response, NextFunction } from "express";
import paginationHelper from "../../helpers/pagination.helper";
import pick from "../../utils/pick";

//[GET] "/products"
export class ProductController {
    constructor(private productService: IProductService) {}

    async getProducts(req: Request, res: Response) {    
        
        const filter: Record<string, any> = {status: "active"};

        //PAGINATION 
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const total = await this.productService.getTotalDocument()
        const pagination = paginationHelper({page, limit,total}) 
        //SORTING 
        const sortKey = req.query.sortKey as string;
        const sortValue = req.query.sortValue as "asc" | "desc";
        
        res.render("clients/pages/products/product.pug",{       
            products: await this.productService.getProducts({pagination, filter, sortKey, sortValue}),
            pagination,  
        })
    }
}