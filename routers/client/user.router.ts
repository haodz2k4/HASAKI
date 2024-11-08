import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/user.controller"
import { requireAuth } from "../../middleware/clients/auth.middleware";

import { storage } from "../../storage/cloud";
import multer from "multer"
const upload = multer({ storage });
import { uploadSingle } from "../../middleware/upload-cloud.middleware";
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

router.get("/verify-email",controller.verifyEmail)

router.patch("/update-password",requireAuth,controller.updatePassword)

router
    .route("/profiles")
    .get(requireAuth,controller.getProfiles)
    .patch(requireAuth,controller.updateProfiles) 

router.post("/upload-avatar",upload.single('avatar'),uploadSingle,controller.uploadAvatar)
router.post("/add-address",requireAuth,controller.addAddress)
router.delete("/remove-address/:index",requireAuth,controller.removeAddres)
export default router