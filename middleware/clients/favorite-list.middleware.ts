import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import favoriteListModel from "../../models/favorite-list.model";

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if(user){
        let favoriteList = await favoriteListModel.findOne({userId: user.id})
        if(!favoriteList){
            favoriteList = await favoriteListModel.create({userId: user.id})
        }
        res.locals.favoriteList = favoriteList
    }
    next()
})