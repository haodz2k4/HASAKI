import { Router } from "express";
const router: Router = Router()
import * as controller from "../controllers/user.controller"
router.patch("/:id",controller.updateUser)
export default router