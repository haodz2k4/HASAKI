import { Express } from 'express';
import  productRouter from "../routers/product.router"
import categoryRouter from "../routers/category.router"
import supplierRouter from "../routers/supplier.router"
import userRouter from "../routers/user.router"
import { serve, setup } from "swagger-ui-express";
import { specs } from '../../swagger';
//API 
const API_PREFIX = '/api'
export default (app: Express) => {
    // Swagger
    app.use('/api-docs', serve, setup(specs));
    app.use(`${API_PREFIX}/products`,productRouter);
    app.use(`${API_PREFIX}/categories`,categoryRouter);
    app.use(`${API_PREFIX}/users`,userRouter);
    app.use(`${API_PREFIX}/suppliers`,supplierRouter)
}