import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import settingGeneralModel from "../../models/setting-general.model";

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const settingGeneral = await settingGeneralModel.findOne()
    res.locals.settingGeneral = settingGeneral
    next()
})