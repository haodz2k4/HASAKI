import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";


export class HomeController {

    async home(req: Request, res: Response) {
        res.render("clients/pages/home/home.pug")
    }
}