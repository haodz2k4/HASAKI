import { Router } from "express";
import * as controller from "../../controllers/admin/product.controller"
const router: Router = Router();

import { storage } from "../../storage/cloud";
import multer from "multer"
const upload = multer({ storage });
import { uploadMulti } from "../../middleware/upload-cloud.middleware";

import { requirePermission } from './../../middleware/admin/permission.middleware';

router.get("/",requirePermission('product_view'),controller.products)
router.patch("/change-multi",requirePermission('product_update'),controller.changeMulti)
router.get("/create",requirePermission('product_create'),controller.create);
router.post("/create",upload.array('thumbnail', 5),requirePermission('product_create'),uploadMulti,controller.createPost)

router
    .route("/update/:id")
    .get(requirePermission('product_update'),controller.updateProduct)
    .patch(requirePermission('product_update'),upload.array('thumbnail', 5),uploadMulti,controller.updateProductPatch) 

router.get("/detail/:id",requirePermission('product_view'),controller.detail)
router.post("/export/excel",requirePermission('product_view'),controller.exportExcel);

export default router