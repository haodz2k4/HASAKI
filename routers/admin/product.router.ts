import { Router } from "express";
import * as controller from "../../controllers/admin/product.controller"
const router: Router = Router();


router.get("/",controller.products)

export default router