import { Request, Response } from "express";
import productModel from "../../models/product.model";
import categoryModel from "../../models/category.model"
//[GET] "/home"
export const home = async (req: Request, res: Response) => {
    
    const soldProducts = await productModel.find({
        deleted: false,
        status: "active"
    }).limit(20)
    
    const products = await productModel.find({
        deleted: false, status: "active", highlighted: "1"
    })
    .limit(20)

    
    const categories = await categoryModel.find({deleted: false, status: "active"})
    res.render("clients/pages/home/home.pug",{
        products,   
        categories,
        pageTitle: "Trang Chủ",
        soldProducts
    })

}