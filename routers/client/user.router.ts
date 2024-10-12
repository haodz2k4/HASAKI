import { Router } from "express";
const router: Router = Router()
import * as controller from "../../controllers/client/user.controller"
router.get("/login",controller.login);

export default router