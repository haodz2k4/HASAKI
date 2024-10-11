import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/product.controller"

import { storage } from "../../storage/cloud";
import multer from "multer";
const upload = multer({ storage });

router  
    .route("/")
    .get(controller.getProducts)
    .post(controller.createProduct)

router
    .route("/:id")
    .get(controller.getProductById)
    .patch(controller.updateProduct)
    .delete(controller.deleteProduct)
router.get("/slug/:slug",controller.getProductBySlug)
router
    .route("/:id/upload")
    .post(upload.single('avatar'),controller.uploadFile)

export default router