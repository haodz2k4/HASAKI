import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/product.controller"
router  
    .route("/")
    .get(controller.getProducts);


export default router