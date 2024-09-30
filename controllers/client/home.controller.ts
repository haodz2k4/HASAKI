import { Request, Response } from "express";
import { IProductService } from "../../services/product.service";
import pick from "../../utils/pick";

export class HomeController {
    constructor(private productService: IProductService) {}
    //[GET] "/"
    async home(req: Request, res: Response) {
        
        res.render("clients/pages/home/home.pug",{
            hightlightedProducts: await this.productService.getProducts({
                filter:  {
                    status: "active",
                    highlighted: "1"
                }, limit: 4}),
            products: await this.productService.getProducts({limit: 20, filter: {status: "active"}}),
            pageTitle: "Trang Chủ"
        })
    }
}