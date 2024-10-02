import { Express } from "express";
import dashboardRouter from "./dashboard.router"

export default (app: Express) => {

    app.use("/admin/dashboard",dashboardRouter)
}