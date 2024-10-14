import { Router } from "express";
import * as controller from "../../controllers/admin/role.controller";
const router = Router()


router.get("/",controller.roles)

router
    .route("/create")
    .get(controller.create)
    .post(controller.createPost)

router
    .route("/update/:id")
    .get(controller.update)
    .patch(controller.updatePatch)
export default router