import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/admin/user.controller";
import { requirePermission } from "../../middleware/admin/permission.middleware";
router.get("/",requirePermission('user_view'),controller.users)

export default router;