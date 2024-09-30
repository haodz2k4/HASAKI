import { Router } from "express";
const router: Router = Router()
import { ProductController } from "../../controllers/client/product.controller";
import { ProductService } from "../../services/product.service";
import { ProductRepository } from "../../repository/product.repository";
import { CacheService } from "../../services/cache.service";

const productController = new ProductController(new ProductService(new ProductRepository(), new CacheService('products')))


router.get("/",productController.getProducts.bind(productController))
router.get("/:slug",productController.getProduct.bind(productController))
export default router