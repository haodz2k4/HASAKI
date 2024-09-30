import { Request, Response } from "express";
import { IProductService } from "../../services/product.service";
import pick from "../../utils/pick";
import paginationHelper from "../../helpers/pagination.helper";
export class HomeController {
    constructor(private productService: IProductService) {}
    //[GET] "/"
    async home(req: Request, res: Response) {
        
        res.render("clients/pages/home/home.pug",{
            hightlightedProducts: await this.productService.getProducts({
                filter:  {
                    status: "active",
                    highlighted: "1"
                }, pagination: {limit: 4}}),
            products: await this.productService.getProducts({pagination: {limit: 20}, filter: {status: "active"}}),
            pageTitle: "Trang Chủ"
        })
    }
}