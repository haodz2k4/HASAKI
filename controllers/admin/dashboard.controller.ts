import { Request, Response } from "express";

//[GET] "/admin/dashboard"
export const dashboard = (req: Request, res: Response) => {

    res.render("admin/pages/dashboard/dashboard.pug",{
        pageTitle: "dashboard",
        activePages: "dashboard"
    })
}