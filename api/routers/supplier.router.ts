import { Router } from "express";
const router = Router()
import * as controller from "../controllers/supplier.controller";
router
    .route("/")
    .get(controller.getSuppliers) 

export default router