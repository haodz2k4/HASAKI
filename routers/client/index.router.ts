import { Express } from "express"
import homeRouter from "./home.router"
import productRouter from "./product.router"
import userRouter from "./user.router";
import cartRouter from "../../routers/client/cart.router";
import checkOutRouter from "./checkout.router"
import orderRouter from "./order.router"
//MDW 
import { requireAuth } from "../../middleware/clients/auth.middleware";
import userMiddleware from "../../middleware/clients/user.middleware";
import settingGeneralMiddleware from "../../middleware/clients/setting-general.middleware";
import cartMiddleware from "../../middleware/clients/cart.middleware";
import favoriteListMiddleware from "../../middleware/clients/favorite-list.middleware";

export default (app: Express) => {
    app.use(settingGeneralMiddleware)
    app.use(userMiddleware)
    app.use(cartMiddleware)
    app.use(favoriteListMiddleware)
    app.use("/",homeRouter) 
    app.use("/products",productRouter) 
    app.use("/users",userRouter) 
    app.use("/cart",requireAuth,cartRouter)
    app.use("/checkout",requireAuth,checkOutRouter)
    app.use("/orders",requireAuth,orderRouter)
    
}