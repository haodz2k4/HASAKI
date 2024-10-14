import { Router } from "express";
import * as controller from "../../controllers/admin/role.controller";
const router = Router()


router.get("/",controller.roles)

export default router