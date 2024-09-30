import { Router } from "express";
import { HomeController } from "../../controllers/client/home.controller";
import { ProductService } from "../../services/product.service";
import { ProductRepository } from "../../repository/product.repository";
import { CacheService } from "../../services/cache.service";
const router: Router = Router();

const productRepository = new ProductRepository()
const productService = new ProductService(productRepository, new CacheService('home'));
const homeController = new HomeController(productService); 

router.get("/",homeController.home.bind(homeController)); 
export default router;
