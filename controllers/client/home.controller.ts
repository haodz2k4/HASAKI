import { Request, Response } from "express";
import { IProductService } from "../../services/product.service";

export class HomeController {
    constructor(private productService: IProductService) {}
    async home(req: Request, res: Response) {
        const products = await this.productService.getProducts();
        res.render("clients/pages/home/home.pug",{
            products,
            pageTitle: "Trang Chủ"
        })
    }
}