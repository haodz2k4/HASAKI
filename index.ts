import express, {Express} from "express"
import dotenv from "dotenv"
dotenv.config()
import config from "./config/config"
import { getConnection } from "./config/mongodb"
import clientRouter from "./routers/client/index.router"
import redis from "./config/redis"
import bodyParser from "body-parser"
import { handleErrorMiddleware } from "./middleware/error.middleware";
import flash from "express-flash"
import cookieParser from "cookie-parser"
import session from "express-session"
import { loggerMiddleware } from "./middleware/logger.middleware"
const bootstrap = () => {
    
    const app: Express = express()
    app.set('view engine', 'pug')
    app.use(express.static('public'))
    app.use(bodyParser.urlencoded({ extended: false }))
    
    //Client router 
    clientRouter(app)
    //redis
    redis
    //Express flash (For Show Alert)
    app.use(cookieParser('keyboard cat'));
    app.use(session({
        secret: config.session_secret as string,
        resave: false,
        saveUninitialized: false,
        cookie: { 
            maxAge: 5000, 
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax'
        }
    }))
    app.use(flash());
    //connect to database 
    getConnection()
    app.use(loggerMiddleware)
    //PORT 
    const port = config.port;
    app.listen(port,() => {
        console.log(`Server is running on port: http://localhost:${port}`)
    })
}
bootstrap()