import { Router } from "express";
import { HomeController } from "../../controllers/client/home.controller";
import { ProductService } from "../../services/product.service";

const router: Router = Router();
const productService = new ProductService();
const homeController = new HomeController(productService); 

router.get("/", homeController.home.bind(homeController)); 
export default router;
