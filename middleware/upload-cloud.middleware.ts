import { Request, Response, NextFunction } from "express"
export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.file){
            const {path, fieldname} = req.file;
            req.body[fieldname] = path;
        }
        next()
    } catch (error) {
        next(error)
    }
}
export const uploadMulti = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files;
        if (files && Array.isArray(files) && files.length > 0) {
            const fieldName = files[0].fieldname;
            const urls: string[] = files.map(item => item.path);
            req.body[fieldName] = urls;
        }
        next();
    } catch (error) {
        next(error);
    }
};