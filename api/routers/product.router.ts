import { Router } from "express";
const router: Router = Router();
import * as handler from "../handler/product.handler"
router.get("/",handler.getProducts)
router
    .route("/:id")
    .patch(handler.updateProduct)
export default router