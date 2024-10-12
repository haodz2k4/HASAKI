import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/user.controller"
router
    .route("/login")
    .get(controller.login)
    .post(controller.loginPost)
export default router