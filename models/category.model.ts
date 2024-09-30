import { ObjectId, Schema, model } from "mongoose";
import { isURL } from "validator";

export const COLLECTION_CATEGORY_NAME = "Category"
export interface ICategory {
    _id: ObjectId
    title: string
    thumbnail: string 
    description: string,
    deleted: boolean,
    slug: string,
    status: string,
    parentCategory: ObjectId
}
const categorySchema = new Schema<ICategory>({
    title: {type: String, required: true, minlength: 2, maxlength: 150},
    thumbnail:{
        type: String,
        validate: {
            validator: function(v: string):boolean {
                return isURL(v)
            },
            message: "invalid thumbnail url"
        }
    },
    description: String,
    deleted: {type: Boolean, default: false},
    slug: {type: String, unique: true},
    status: {
        type: String,
        enum: {values: ["active","inactive"], message: 'Status must be either "active" or "inactive"'},
        default: "active"
    },
    parentCategory: {type: Schema.Types.ObjectId, ref: COLLECTION_CATEGORY_NAME}
   
},{timestamps: true})
export default model<ICategory>(COLLECTION_CATEGORY_NAME,categorySchema)