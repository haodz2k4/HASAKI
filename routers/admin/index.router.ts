import { Express } from "express";
import dashboardRouter from "./dashboard.router"
import productRouter from "./product.router"
import userRouter from "./user.router"
export default (app: Express) => {
    app.use("/admin/products",productRouter)
    app.use("/admin/dashboard",dashboardRouter)
    app.use("/admin/users",userRouter)
}