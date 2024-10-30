import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/checkout.controller"

router.get("/",controller.checkout)
export default router