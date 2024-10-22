import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/product.controller"

import { storage } from "../../storage/cloud";
import multer from "multer";
const upload = multer({ storage });

import { requireAuth, requirePermission } from "../middlewares/auth.middleware";

import { cacheMiddleware } from "../middlewares/cache.middleware";
router  
    .route("/")
    .get(requirePermission('product_view'),controller.getProducts)
    .post(requireAuth,requirePermission('product_create'),controller.createProduct)

router
    .route("/:id")
    .get(requirePermission('product_view'),controller.getProductById)
    .patch(requireAuth,requirePermission('product_update'),controller.updateProduct)
    .delete(requireAuth,requirePermission('product_delete'),controller.deleteProduct)
router.get("/slug/:slug",requireAuth,requirePermission('product_view'),cacheMiddleware('product', 7200),controller.getProductBySlug)
router
    .route("/:id/upload")
    .post(requireAuth,requirePermission('product_create'),upload.single('avatar'),controller.uploadFile)

export default router