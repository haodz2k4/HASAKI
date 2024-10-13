import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import userModel from "../../models/user.model";

import paginationHelper from "../../helpers/pagination.helper";
import filterHelper from "../../helpers/filter.helper";

//[GET] "/admin/users"
export const users = catchAsync(async (req: Request, res: Response) => {
    
    const filter: Record<string, unknown> = {
        deleted: false,
    }
    
    //Filters list
    const filters = await filterHelper([
        {
            name: 'nam',
            value: 'gender-nam',
            selected: false
        },
        {
            name: 'nữ',
            value: 'gender-nữ',
            selected: false
        }
    ]);

    const status = req.query.status as string;
    if(status){
        filter.status = status 
        const index = filters.findIndex((item) => item.name === status);
        filters[index].selected = true;
    }

    const gender = req.query.gender as string;
    if(gender){
        filter.gender = gender
        const index = filters.findIndex((item) => item.name === gender)
        filters[index].selected = true
    }

    
    //seach
    const keyword = req.query.keyword as string;
    if(keyword){
        filter.fullName = new RegExp(keyword,"i")
    }

    //Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const [users, count] = await Promise.all([
        await userModel.find(filter),
        await userModel.countDocuments({deleted: false})
    ])
    const pagination = paginationHelper(page, limit, count);
    res.render("admin/pages/users/user.pug",{
        pageTitle: "Quản lý người dùng",
        activePages: "users",
        users,
        pagination,
        filters,
        keyword
    })
})