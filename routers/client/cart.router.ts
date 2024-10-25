import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/cart.controller"

router.get("/",controller.cart)
router.post("/add/:productId", controller.add)
router.delete("/remove/:productId",controller.removeProductFormcart)
router.patch("/update/multi/:type",controller.updateMulti)
export default router;