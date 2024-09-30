import express from "express"
import dotenv from "dotenv"
import config from "./config/config"




const bootstrap = () => {
    
    const app = express()
    //Config Dotenv 
    dotenv.config()


    //PORT 
    const port = config.port;
    app.listen(port,() => {
        console.log(`Server is running on port: http://localhost:${port}`)
    })
}
bootstrap()