import { Request, Response, NextFunction } from "express"
import { RenderError } from "../../utils/error";

export const requirePermission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const account = res.locals.account;
        if(!account.roleId.permissions.includes(permission)) {
            throw new RenderError(403,"Bạn không có đủ quyền")
        }
        next()
    }
}