import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/cart.controller";


import * as validation from "../../validations/clients/cart.validation"
router.get("/",controller.cart)
router.post("/add/:productId",validation.add, controller.add)
router.delete("/remove/:productId",controller.removeProductFormcart)
router.patch("/update/multi/:type",controller.updateMulti)
router.patch("/change/quantity/:productId/:quantity",controller.updateCartItemQuantity)
export default router;