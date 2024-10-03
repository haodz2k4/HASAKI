import { Request, Response } from "express";
import * as productService from "../../services/product.service"
import paginationHelper from "../../helpers/pagination.helper";
//[GET] "/admin/products"
export const products = async (req: Request, res: Response) => {

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const totalDocument = await productService.getTotalDocument();
    const pagination = paginationHelper(page, limit, totalDocument)
    const {skip} = pagination
    const products = await productService.getAllProductsByQuery({limit, skip})
    res.render("admin/pages/products/product.pug",{
        activePages: "products",
        products,
        pagination
    })
}