import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/inventory.controller";
router.get("/",controller.inventory)
router  
    .route("/create")
    .get(controller.create)
    .post(controller.createPost)
export default router;