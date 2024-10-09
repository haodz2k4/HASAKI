import { Router } from "express";
import * as controller from "../../controllers/admin/product.controller"
const router: Router = Router();

import { storage } from "../../storage/cloud";
import multer from "multer"
const upload = multer({ storage });
import { uploadSingle } from "../../middleware/upload-cloud.middleware";

router.get("/",controller.products)
router.patch("/change-multi",controller.changeMulti)
router.get("/create",controller.create);
router.post("/create",upload.single('thumbnail'),uploadSingle,controller.createPost)
export default router