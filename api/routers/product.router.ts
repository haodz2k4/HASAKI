import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/product.controller"

import { storage } from "../../storage/cloud";
import multer from "multer";
const upload = multer({ storage });

import { requireAuth } from "../middlewares/auth.middleware";
router  
    .route("/")
    .get(controller.getProducts)
    .post(requireAuth,controller.createProduct)

router
    .route("/:id")
    .get(controller.getProductById)
    .patch(requireAuth,controller.updateProduct)
    .delete(requireAuth,controller.deleteProduct)
router.get("/slug/:slug",controller.getProductBySlug)
router
    .route("/:id/upload")
    .post(requireAuth,upload.single('avatar'),controller.uploadFile)

export default router