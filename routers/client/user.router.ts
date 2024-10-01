// routes/user.routes.ts
import { Router } from "express";
const router: Router = Router();
import { UserController } from "../../controllers/client/user.controller";
import { UserRepository } from "../../repository/user.repository";
import { UserService } from "../../services/user.service";
import catchAsync from "../../utils/catchAsync";


const userController = new UserController(new UserService(new UserRepository()));

router.get("/login", catchAsync(userController.login.bind(userController)));
router.post("/login", catchAsync(userController.loginPost.bind(userController)));

export default router;
