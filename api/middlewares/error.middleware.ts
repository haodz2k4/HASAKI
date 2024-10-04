import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error";

export const handleErrorMiddleware: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof ApiError) {
        res.status(err.code).json({
            statusCode: err.code,
            error: err.message,
        });
    } else {
        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: err.message || "Something went wrong",
        });
    }
};
