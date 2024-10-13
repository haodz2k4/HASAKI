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
    .post(controller.registerPost)
router.post("/logout",controller.logout)
export default router