import { SwaggerUiOptions } from './node_modules/@types/swagger-ui-express/index.d';
import express, {Express} from "express"
import dotenv from "dotenv"
dotenv.config()
import config from "./config/config"
import { getConnection } from "./config/mongodb"
import clientRouter from "./routers/client/index.router"
import redis from "./config/redis"
import bodyParser from "body-parser"
import flash from "express-flash"
import cookieParser from "cookie-parser"
import session from "express-session"
import { loggerMiddleware } from "./middleware/logger.middleware"
import api from "./api/routers/index.router"
import adminRouter from "./routers/admin/index.router"
import moment from "moment"
import {serve, setup} from "swagger-ui-express"
import { specs } from './swagger';
const bootstrap = () => {
    
    const app: Express = express()
    app.set('view engine', 'pug')
    app.use(express.static('public'))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use('/api-docs', serve, setup(specs));
    //Logger 
    app.use(loggerMiddleware)
    //Router Api 
    api(app) 
    //admin router 
    adminRouter(app)
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
    //moment 
    moment.locale('vi');
    app.locals.moment = moment
    //express flash
    app.use(flash());
    //connect to database 
    getConnection()
    //PORT 
    const port = config.port;
    app.listen(port,() => {
        console.log(`Server is running on port: http://localhost:${port}`)
    })
}
bootstrap()