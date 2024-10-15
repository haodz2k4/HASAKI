import { Router } from 'express';
const router: Router = Router()
import * as controller from "../../controllers/admin/account.controller";
import { storage } from '../../storage/cloud';
import multer from "multer";
import { uploadSingle } from '../../middleware/upload-cloud.middleware';
const upload = multer({storage});
router.get("/", controller.accounts)
router
    .route("/create")
    .get(controller.create)
    .post(upload.single('avatar'),uploadSingle,controller.createPost)
router
    .route("/update/:id")
    .get(controller.update)
    .patch(upload.single('avatar'),uploadSingle,controller.updatePatch)

router.get("/detail/:id",controller.detail)
export default router;