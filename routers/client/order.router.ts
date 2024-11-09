import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/order.controller"

router.get("/:id",controller.order) 
router.patch("/:id/confirmed",controller.confirmedOrder)
router.patch("/:id/cancel",controller.cancelOrder)
export default router