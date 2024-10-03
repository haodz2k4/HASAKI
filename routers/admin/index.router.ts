import { Express } from "express";
import dashboardRouter from "./dashboard.router"
import productRouter from "./product.router"
export default (app: Express) => {
    app.use("/admin/products",productRouter)
    app.use("/admin/dashboard",dashboardRouter)
}