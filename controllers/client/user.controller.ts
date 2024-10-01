import { IUserService } from "../../services/user.service";
import { Request, Response } from "express";
import { ResponseError } from "../../utils/error.utils";


export class UserController {

    constructor(private userService: IUserService) {}
    //[GET]  "/user/login"
    async login(req: Request, res: Response) {
        
        res.render("clients/pages/users/login.pug")
    }
    //[POST] "/user/login"
    async loginPost(req: Request, res: Response) {
        const {email, password} = req.body;
        const user = await this.userService.findOneByEmail(email);
        if(!user){
            throw new ResponseError(404,"User is not found");
        }
        res.redirect("back")
    }
}