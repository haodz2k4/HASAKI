import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/admin/setting.controller";

import multer from "multer";
import { storage } from "../../storage/cloud";
import { uploadSingle } from "../../middleware/upload-cloud.middleware";
const upload = multer({storage})
router
    .route("/general")
    .get(controller.general)
    .patch(upload.single('logo'),uploadSingle,controller.generalPatch)

export default router