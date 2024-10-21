import { Request, Response } from "express";
import productModel from "../../models/product.model";
import categoryModel from "../../models/category.model"
//[GET] "/home"
export const home = async (req: Request, res: Response) => {
    
    const firstProductsCarousel = await productModel.find({
        deleted: false,
        status: "active"
    }).limit(10)
    const secondProductsCarousel = await productModel.find({
        deleted: false,
        status: "active"
    }).limit(10).skip(10)
    
    const products = await productModel.find({
        deleted: false, status: "active", highlighted: "1"
    })
    .limit(20)

    
    const firstCategoriesCarousel = await categoryModel
        .find({deleted: false, status: "active"})
        .limit(8) 
    const secondCategoriesCarousel = await categoryModel 
        .find({deleted: false, status: "active"})
        .limit(8)
        .skip(8) 
    res.render("clients/pages/home/home.pug",{
        products,   
        firstCategoriesCarousel,
        secondCategoriesCarousel,
        pageTitle: "Trang Chủ",
        firstProductsCarousel,
        secondProductsCarousel
    })

}