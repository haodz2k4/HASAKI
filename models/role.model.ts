import { Schema, model } from "mongoose";

export const COLLECTION_ROLE_NAME ='Role'
export interface IRole {
    title: string
    description: string 
    permissions: string[],
    deleted: boolean
}

const roleSchema = new Schema<IRole>({
    title: {type: String ,required: true},
    description: String,
    permissions:[{type: String, default: []}],
    deleted: {
        type: Boolean,
        default: false
    }   
},{timestamps: true}) 

export default model<IRole>(COLLECTION_ROLE_NAME,roleSchema)