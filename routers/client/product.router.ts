import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/product.controller"
router.get("/",controller.products)
router.get("/:slug",controller.detail)
router.patch("/favorite-list/toggle/:id",controller.toggleFavoriteList)
export default router