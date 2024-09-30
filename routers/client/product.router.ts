import { Router } from "express";
const router: Router = Router()
import { ProductController } from "../../controllers/client/product.controller";
import { ProductService } from "../../services/product.service";
import { ProductRepository } from "../../repository/product.repository";
const productService = new ProductService(new ProductRepository())
const productController = new ProductController(productService)
router.get("/",productController.getProducts.bind(productController))

export default router