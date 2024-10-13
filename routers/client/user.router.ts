import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/user.controller"
router
    .route("/login")
    .get(controller.login)
    .post(controller.loginPost)
router
    .route('/register')
    .get(controller.register)
export default router