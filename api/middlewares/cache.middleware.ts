import { NextFunction, Request, Response } from "express";
import {CacheRedis} from "../services/cache.service"
export const cacheMiddleware = (key: string, ttl: string | number) => {

    return async (req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            //example 1: `products:/api/products?status=inactive`
            //example 2: `product:/api/products/:id`
            const redisKey = `${key}:${req.originalUrl}`
            const cache = new CacheRedis(redisKey)
            const cachedData = await cache.getData()
            if(cachedData){
                res.json(cachedData)
                return 
            }
            const originalJson = res.json.bind(res);
    
            res.json = (data) => {
                cache.setCache(ttl, data);
                return originalJson(data);
            };
            res.locals.CacheRedis = cache
            next()
        } catch (error) {
            next(error)
        }

    }
} 