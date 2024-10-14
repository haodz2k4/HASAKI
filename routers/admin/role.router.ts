import { Router } from "express";
import * as controller from "../../controllers/admin/role.controller";
const router = Router()


router.get("/",controller.roles)
router.get("/detail/:id",controller.detail)

router
    .route("/create")
    .get(controller.create)
    .post(controller.createPost)

router
    .route("/update/:id")
    .get(controller.update)
    .patch(controller.updatePatch)
router.delete("/remove/:id",controller.remove)
export default router