import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/admin/auth.controller";

router
    .route("/login")
    .get(controller.login)
    .post(controller.loginPost)
router.post("/logout",controller.logout)
export default router;