import { NextFunction, Request, Response } from "express";


// Logger middleware
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = process.hrtime();  
    console.log(`>>> ${new Date().toISOString()} | ${req.ip} | ${req.method} ${req.originalUrl}`);
    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const responseTime = (seconds * 1000 + nanoseconds / 1e6).toFixed(2); 
        const statusCode = res.statusCode; 
        console.log(`<<< ${new Date().toISOString()} | ${req.ip} | ${req.method} ${req.originalUrl} | Status: ${statusCode} | Time: ${responseTime} ms`);
    });
    next();
}
