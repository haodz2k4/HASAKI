import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/checkout.controller"
import * as validation from "../../validations/clients/checkout.validation"

router
    .route("/")
    .post(validation.checkoutPost,controller.checkoutPost) 
router
    .route("/order")
    .post(validation.orderPost,controller.orderPost) 
router.get("/order/:id/success",controller.orderSuccess)
router.post("/order/momo/payment",controller.checkOutMomo);
export default router