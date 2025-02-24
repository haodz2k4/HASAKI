import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "./config/config";
import { getConnection } from "./config/mongodb";
import clientRouter from "./routers/client/index.router";
import bodyParser from "body-parser";
import flash from "express-flash";
import cookieParser from "cookie-parser";
import session from "express-session";
import { loggerMiddleware } from "./middleware/logger.middleware";
import adminRouter from "./routers/admin/index.router";
import moment from "moment";
import errorMiddleware from './middleware/error.middleware';
import methodOverride from "method-override";
import path from "path";
import api from "./api/routers/index.router"
import notFoundMdw from "./middleware/404.middleware"
import { formatPrice } from "./utils/format.utils";
import {createServer} from "http";
import { Server } from "socket.io";

const app: Express = express();
const server = createServer(app); 
export const io = new Server(server); 

const bootstrap = () => {

    // viewengine 
    app.set('view engine', 'pug');

    // Static files
    app.use(express.static('public'));

    // Cookie Parser
    app.use(cookieParser('keyboard cat'));

    // Session
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
    }));

    //Tiny Mce 
    app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

    // Express Flash 
    app.use(flash());

    // Body Parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    // Method Override 
    app.use(methodOverride('_method'));

    // Logger Middleware
    app.use(loggerMiddleware);

    //Format price 
    app.locals.formatPrice = formatPrice
    // Moment.js
    moment.locale('vi');
    app.locals.moment = moment;

    /*API*/
    //router
    api(app)
    
    // Router Admin and client 
    adminRouter(app);
    clientRouter(app);
    
    
    // Redis
    // Error Middleware 
    app.use(errorMiddleware);

    // Connect to mongodb
    getConnection();

    /*END API*/

    //404 page
    app.use('*', notFoundMdw)
    // Start server
    const port = config.port;
    server.listen(port, () => {
        console.log(`Server đang chạy trên port: http://localhost:${port}`);
    });
}

bootstrap();
