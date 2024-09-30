import express from "express"
import dotenv from "dotenv"
dotenv.config()
import config from "./config/config"
import { getConnection } from "./config/mongodb"




const bootstrap = () => {
    
    const app = express()

    //connect to database 
    getConnection()
    //PORT 
    const port = config.port;
    app.listen(port,() => {
        console.log(`Server is running on port: http://localhost:${port}`)
    })
}
bootstrap()