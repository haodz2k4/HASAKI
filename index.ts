import express from "express"
import dotenv from "dotenv"
dotenv.config()
import config from "./config/config"
import { getConnection } from "./config/mongodb"
import clientRouter from "./routers/client/index.router"
import { TransFormDataResponse } from "./middleware/transform-response.middleware"
import redis from "./config/redis"
import bodyParser from "body-parser"
import { handleErrorMiddleware } from "./middleware/error.middleware"
const bootstrap = () => {
    
    const app = express()
    app.set('view engine', 'pug')
    app.use(express.static('public'))
    app.use(bodyParser.urlencoded({ extended: false }))

    
    //connect to database 
    getConnection()
    //Transform Response local here 
    app.use(TransFormDataResponse)
    redis
    //Client router 
    clientRouter(app)
    //Handle error
    app.use(handleErrorMiddleware)
    //PORT 
    const port = config.port;
    app.listen(port,() => {
        console.log(`Server is running on port: http://localhost:${port}`)
    })
}
bootstrap()