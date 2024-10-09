import { Express } from 'express';
import  productRouter from "../routers/product.router"

//API 
const API_PREFIX = '/api'
export default (app: Express) => {
    app.use(`${API_PREFIX}/products`,productRouter)
}