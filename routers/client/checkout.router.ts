import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/checkout.controller"

router
    .route("/")
    .post(controller.checkoutPost) 
router
    .route("/order")
    .post(controller.orderPost)
export default router