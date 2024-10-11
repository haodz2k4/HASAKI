import { Express } from 'express';
import  productRouter from "../routers/product.router"
import { serve, setup } from "swagger-ui-express";
import { specs } from '../../swagger';
//API 
const API_PREFIX = '/api'
export default (app: Express) => {
    // Swagger
    app.use('/api-docs', serve, setup(specs));
    app.use(`${API_PREFIX}/products`,productRouter)

}