import { Router } from "express";
const router: Router = Router();
import * as handler from "../handler/product.handler"
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     description: Trả về danh sách tất cả các sản phẩm.
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/",handler.getProducts)
router
    .route("/:id")
    .patch(handler.updateProduct)
export default router