import { Router } from "express";
const router: Router = Router();
import * as handler from "../handler/product.handler"
router.get("/",handler.getProducts)

export default router