import { Express } from "express"
import responseTransformerMiddleware from "../middlewares/response-transformer.middleware"
import productRouter from "./product.router"
export default (app: Express) => {
    app.use(responseTransformerMiddleware)
    app.use("/api/products", productRouter)
}