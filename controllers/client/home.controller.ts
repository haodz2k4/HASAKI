import { Request, Response } from "express";
import { getAllProductsByQuery } from "../../services/product.service";
//[GET] "/home"
export const home = async (req: Request, res: Response) => {
    
    const hightlightedProducts = await getAllProductsByQuery({filter: {status: "active",highlighted: "1" }, limit: 12});
    const products = await getAllProductsByQuery({filter: {status: "active"}, limit: 20});
    res.render("clients/pages/home/home.pug",{
        hightlightedProducts,
        products
    })

}