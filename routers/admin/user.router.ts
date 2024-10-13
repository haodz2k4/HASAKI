import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/admin/user.controller";
router.get("/",controller.users)

export default router;