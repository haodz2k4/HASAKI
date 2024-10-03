import { Request, Response } from "express";

//[GET] "/admin/products"
export const products = (req: Request, res: Response) => {
    res.render("admin/pages/products/product.pug",{
        activePages: "products"
    })
}