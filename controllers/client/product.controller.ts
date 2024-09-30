import { IProductService } from "../../services/product.service";
import { Request, Response, NextFunction } from "express";
import paginationHelper from "../../helpers/pagination.helper";
import pick from "../../utils/pick";

//[GET] "/products"
export class ProductController {
    constructor(private productService: IProductService) {}
    //[GET] "/products"
    async getProducts(req: Request, res: Response) {    
        
        const filter: Record<string, any> = {status: "active"};
        //range price 
        const minPrice = parseInt(req.query.minPrice as string) 
        const maxPrice = parseInt(req.query.maxPrice as string);
        const rangePrice: Record<string, any> = [];

        if (minPrice) {
            rangePrice.push({ price: { $gte: minPrice } });
        }
        if (maxPrice) {
            rangePrice.push({ price: { $lte: maxPrice } }); 
        }
        if(rangePrice.length > 0){
            filter.$and = rangePrice;
        }
        //PAGINATION 
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const total = await this.productService.getTotalDocument(filter)
        const pagination = paginationHelper({page, limit,total}) 
        //SORTING 
        const sortKey = req.query.sortKey as string;
        const sortValue = req.query.sortValue as "asc" | "desc";
       
        
        res.render("clients/pages/products/product.pug",{       
            products: await this.productService.getProducts({pagination, filter, sortKey, sortValue}),
            pagination,  
            sortString: `${sortKey}-${sortValue}`,
            minPrice,
            maxPrice
        })
    }
    //[GET] "/products/:slug"
    async getProduct(req: Request, res: Response) {
        const {slug} = req.params;
        const product = await this.productService.getProductBySlug(slug);
        res.render("clients/pages/products/detail.pug", {
            product
        })
    }
}