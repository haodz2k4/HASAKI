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

router
    .route('/forgot-password')
    .get(controller.forgotPassword)
    .post(controller.forgotPasswordPost)

router
    .route("/verify-otp")
    .get(controller.verifyOtp)
    .post(controller.verifyOtpPost)

router
    .route("/reset-password")
    .get(controller.resetPassword)
    .post(controller.resetPasswordPost)
router.post("/logout",controller.logout)
export default router