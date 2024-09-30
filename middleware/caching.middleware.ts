import { Request, Response, NextFunction } from "express";
import { CacheService } from "../services/cache.service";

const cachingMiddleware = (key: string, ttl: string | number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const cacheKey = `${key}-${req.originalUrl}`;
        const cache = new CacheService(cacheKey);

        const cachedData = await cache.getCache();
        if (cachedData) {
            return res.render(res.locals.view, JSON.parse(cachedData));
        }
        const originalRender = res.render.bind(res);

        res.render = async (view: string, locals?: Record<string, any>) => {
            res.locals.view = view;
            await cache.setCache(JSON.stringify(locals), ttl);
            originalRender(view, locals);
        };
        next();
    };
};
