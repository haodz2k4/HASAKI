import { IUserService } from "../../services/user.service";
import { Request, Response } from "express";
import { ResponseError } from "../../utils/error.utils";


export class UserController {

    constructor(private userService: IUserService) {}
    //[GET]  "/users/login"
    async login(req: Request, res: Response) {
        
        res.render("clients/pages/users/login.pug",{
            pageTitle: "Đăng nhập"
        })
    }
    //[POST] "/user/login"
    async loginPost(req: Request, res: Response) {
        const {email, password} = req.body;
        const user = await this.userService.findOneByEmail(email);
        if(!user){
            req.flash('error', 'Email or password is not found');
            res.redirect("back");
            return;
        }
        res.redirect("back")
    }
}