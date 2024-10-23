import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/cart.controller"

router.get("/",controller.cart)
router.post("/add/:id", controller.add)

export default router;