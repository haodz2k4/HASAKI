import { RedisKey } from "ioredis"
import redis from "../../config/redis"
import { NullableType } from "../utils/types/nullable";


export class CacheRedis {

    public redisKey: RedisKey;

    constructor(redisKey: RedisKey) {
        this.redisKey = redisKey;
    }

    async getData(): Promise<NullableType<unknown>> {
        const data = await redis.get(this.redisKey)
        if(data){
            return JSON.parse(data)
        }
        return data
    }

    async setCache(ttl: string | number, value: any) {
        await redis.setex(this.redisKey,ttl, JSON.stringify(value))
    }

    async deleteCache() {
        await redis.del(this.redisKey)
    }

    static async removeCache(redisKey: RedisKey) {
        await redis.del(redisKey)
    }

    async scanRedis() {
        
    }
}