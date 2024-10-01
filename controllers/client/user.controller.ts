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
    //[POST] "/users/login"
    async loginPost(req: Request, res: Response) {
        const {email, password} = req.body;
        console.log(email, password)
        const user = await this.userService.findOneByEmail(email);
        console.log(user)
        if(!user || !user.isPasswordMatch(password)){
            req.flash('error', 'Email or password is not found');
            res.redirect("back");
            return;
        }
        res.redirect("/")
    }
    //[GET] "/users/register"
    async register(req: Request, res: Response) {
        res.render("clients/pages/users/register.pug",{
            pageTitle: "Đăng Ký Tài Khoản"
        })
    }
    //[POST] "/users/register"
    async registerPost(req: Request, res: Response) {
        const body = req.body;

        const user = await this.userService.create(body);
        req.flash('success',"Register successfully")
        res.redirect("/users/login")
    }
}