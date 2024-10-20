import { Router } from "express";
import * as controller from "../controllers/category.controller"
const router: Router = Router()

router
    .route("/")
    .get(controller.getCategories) 
    .post(controller.createCategory)

router 
    .route("/:id")
    .get(controller.getCategoryById)
    .patch(controller.updateCategory)
    .delete(controller.deleteCategory)

router.get("/slug/:slug",controller.getCategoryBySlug)
export default router