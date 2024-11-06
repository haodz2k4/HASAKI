import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/admin/order.controller"

router.get("/",controller.order) 
router.get("/detail/:id",controller.getOrder)
export default router