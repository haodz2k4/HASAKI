import { Express } from "express"
import homeRouter from "./home.router"
import productRouter from "./product.router"
import userRouter from "./user.router";
//MDW 
import { requireAuth } from "../../middleware/clients/auth.middleware";
import userMiddleware from "../../middleware/clients/user.middleware";
import settingGeneralMiddleware from "../../middleware/clients/setting-general.middleware";
export default (app: Express) => {
    app.use(settingGeneralMiddleware)
    app.use(userMiddleware)
    app.use("/",homeRouter) 
    app.use("/products",productRouter) 
    app.use("/users",userRouter) 
    
}