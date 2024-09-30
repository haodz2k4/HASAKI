import { Router } from "express";
const router: Router = Router()
import { HomeController } from "../../controllers/client/home.controller";
const homeController = new HomeController();
import catchAsync from "../../utils/catchAsync";
router.get("/",catchAsync(homeController.home))

export default router;