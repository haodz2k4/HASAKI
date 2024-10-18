import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import settingGeneralModel from "../../models/setting-general.model";


//[GET] "/admin/settings/general"
export const general = catchAsync(async (req: Request, res: Response) => {
    const settingGeneral = await settingGeneralModel.findOne();
    res.render("admin/pages/settings/general.pug",{
        settingGeneral,
        activePages: 'setting-general',
        pageTitle: 'Cài đặt chung'
    })
})