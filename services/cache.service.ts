import redis from "../config/redis";


export class CacheService {

    constructor(private cacheKey: string) {} 

    async setCacheKey(cacheKey: string) {
        this.cacheKey += cacheKey
    }

    async setCache(seconds: string | number, data: any) :Promise<"OK"> {
        return await redis.setex(this.cacheKey,seconds, JSON.stringify(data) )
    }

    async getCache(): Promise<any> {
        const cached = await redis.get(this.cacheKey);
        return cached ? JSON.parse(cached) : null
    }
}