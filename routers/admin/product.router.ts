import { Router } from "express";
import * as controller from "../../controllers/admin/product.controller"
const router: Router = Router();


router.get("/",controller.products)
router.patch("/change-multi",controller.changeMulti)
router.get("/create",controller.create);
router.post("/create",controller.createPost)
export default router