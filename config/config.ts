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
    session_secret: process.env.SESSION_SECRET,
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    jwt: {
        user: {
            jwt_access_secret: process.env.JWT_USER_ACCESS_SECRET,
            jwt_access_expire: process.env.JWT_USER_ACCESS_EXPIRE,

            jwt_refresh_secret: process.env.JWT_USER_REFRESH_SECRET,
            jwt_refresh_expire: process.env.JWT_USER_REFRESH_EXPIRE,

            jwt_verify_email: process.env.JWT_VERIFY_EMAIL,
            jwt_password_reset_secret: process.env.JWT_PASSWORD_RESET_SECRET
        },
        admin: {
            jwt_access_secret: process.env.JWT_ADMIN_ACCESS_SECRET,
            jwt_access_expire: process.env.JWT_ADMIN_ACCESS_EXPIRE
        },

    },
    mail: {
        from: process.env.SMTP_FROM,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASS
        }
    }

}