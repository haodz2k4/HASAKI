import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/product.controller"
router.get("/",controller.products)
router.get("/:slug",controller.detail)
export default router