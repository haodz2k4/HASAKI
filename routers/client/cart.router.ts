import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/cart.controller";

import validationMiddleware from "../../middleware/validation.middleware";

import * as validation from "../../validations/clients/cart.validation"
router.get("/",controller.cart)
router.post("/add/:productId",validationMiddleware(validation.add), controller.add)
router.delete("/remove/:productId",controller.removeProductFormcart)
router.patch("/update/multi/:type",controller.updateMulti)
export default router;