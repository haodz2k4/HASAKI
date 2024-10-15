import { Express } from "express";
import dashboardRouter from "./dashboard.router"
import productRouter from "./product.router"
import userRouter from "./user.router"
import roleRouter from "./role.router"
import accountRouter from "./account.router"
import authRouter from "./auth.router"
import { requireAuth } from "../../middleware/admin/auth.middleware";

export default (app: Express) => {

    
    app.use("/admin/products",requireAuth,productRouter)
    app.use("/admin/dashboard",requireAuth,dashboardRouter)
    app.use("/admin/users",requireAuth,userRouter)
    app.use("/admin/roles",requireAuth, roleRouter)
    app.use("/admin/accounts",requireAuth, accountRouter)
    app.use("/admin/auth", authRouter)
}