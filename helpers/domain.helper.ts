import { Request } from "express"
export const getDomain = (req: Request): string => {
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}`
}