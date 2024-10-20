import { Router } from "express";
import * as controller from "../controllers/category.controller"
const router: Router = Router()

router
    .route("/")
    .get(controller.getCategories) 

export default router