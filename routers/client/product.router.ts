import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/product.controller"
import { requireAuth } from "../../middleware/clients/auth.middleware";
router.get("/",controller.products)
router.get("/:slug",controller.detail)
router.patch("/favorite-list/toggle/:id",requireAuth,controller.toggleFavoriteList)
router.post("/:id/product-reviews",controller.addProductReview)
export default router