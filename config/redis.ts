import { Redis } from "ioredis";
import config from "./config";
const redis = new Redis(config.redis) 



redis.on('connect', () => {
    console.log('Connected to redis')
})
redis.on('error',(error) => {
    console.log('Redis error', error)
})

export default redis