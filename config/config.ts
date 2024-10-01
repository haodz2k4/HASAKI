export default {
    port: process.env.PORT,
    mongodb: process.env.MONGODB_URL,
    redis: {
        port: parseInt(process.env.REDIS_PORT as string),
        host: process.env.REDIS_HOST,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        db: 0
    },
    session_secret: process.env.SESSION_SECRET 

}