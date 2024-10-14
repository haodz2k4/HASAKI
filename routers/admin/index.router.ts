import { Express } from "express";
import dashboardRouter from "./dashboard.router"
import productRouter from "./product.router"
import userRouter from "./user.router"
import roleRouter from "./role.router"

export default (app: Express) => {
    app.use("/admin/products",productRouter)
    app.use("/admin/dashboard",dashboardRouter)
    app.use("/admin/users",userRouter)
    app.use("/admin/roles", roleRouter)
}