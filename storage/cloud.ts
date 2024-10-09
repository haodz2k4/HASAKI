import {v2} from "cloudinary";
import {CloudinaryStorage } from "multer-storage-cloudinary";
import config from "../config/config";
v2.config(config.cloudinary);
export const storage = new CloudinaryStorage({
    cloudinary: v2,
    params: {
        folder: 'CloudinaryDemo',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    }  as any 

})