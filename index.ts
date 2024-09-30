import express from "express"
import dotenv from "dotenv"
dotenv.config()
import config from "./config/config"
import { getConnection } from "./config/mongodb"
import clientRouter from "./routers/client/index.router"



const bootstrap = () => {
    
    const app = express()
    app.set('view engine', 'pug')
    app.use(express.static('public'))
    //connect to database 
    getConnection()
    //Client router 
    clientRouter(app)
    //PORT 
    const port = config.port;
    app.listen(port,() => {
        console.log(`Server is running on port: http://localhost:${port}`)
    })
}
bootstrap()