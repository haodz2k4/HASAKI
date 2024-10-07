import { Request, Response } from "express";
import productModel from "../../models/product.model";
//[GET] "/home"
export const home = async (req: Request, res: Response) => {
    
    const hightlightedProducts = await productModel.find({status: 'active', limit: 5, deleted: false})
    const products = await productModel
        .find({status: "active", deleted: false})
        .limit(18)
    res.render("clients/pages/home/home.pug",{
        hightlightedProducts,
        products,   
        pageTitle: "Trang Chủ"
    })

}