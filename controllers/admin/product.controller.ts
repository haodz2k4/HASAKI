import { Request, Response } from "express";
import * as productService from "../../services/product.service"
//[GET] "/admin/products"
export const products = async (req: Request, res: Response) => {
    const products = await productService.getAllProductsByQuery({})
    res.render("admin/pages/products/product.pug",{
        activePages: "products",
        products
    })
}