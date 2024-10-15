import { Router } from 'express';
const router: Router = Router()
import * as controller from "../../controllers/admin/account.controller";
router.get("/", controller.accounts)

router
    .route("/create")
    .get(controller.create)
export default router;