import { Router } from "express";
const router: Router = Router()
import { ProductController } from "../../controllers/client/product.controller";
import { ProductService } from "../../services/product.service";
import { ProductRepository } from "../../repository/product.repository";

const productController = new ProductController(new ProductService(new ProductRepository()))


router.get("/",productController.getProducts.bind(productController))

export default router