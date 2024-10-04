import { Express } from "express"
import productRouter from "./product.router"
import { handleErrorMiddleware } from "../middlewares/error.middleware";
export default (app: Express) => {
    app.use("/api/products", productRouter)
    app.use(handleErrorMiddleware);
}