import { Request, Response} from "express";
import { catchAsync } from "../utils/catchAsync";

export default catchAsync(async (req: Request, res: Response) => {
    res.render("common/404.pug", {
        message: `Không thể ${req.method}:${req.originalUrl} `
    })
})