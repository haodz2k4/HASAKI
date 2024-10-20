import { Router } from "express";
import * as controller from "../controllers/category.controller"
import { requireAuth, requirePermission } from "../middlewares/auth.middleware";
const router: Router = Router()

router
    .route("/")
    .get(requirePermission('category_view'),controller.getCategories) 
    .post(requireAuth,requirePermission('category_create'),controller.createCategory)

router 
    .route("/:id")
    .get(requirePermission('category_view'),controller.getCategoryById)
    .patch(requireAuth,requirePermission('category_update'),controller.updateCategory)
    .delete(requireAuth,requirePermission('category_delete'),controller.deleteCategory)

router.get("/slug/:slug",requirePermission('category_view'),controller.getCategoryBySlug)
export default router