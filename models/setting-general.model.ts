import { Schema, model } from "mongoose";

export const COLLECTION_SETTING_GENERAL_NAME = 'Setting-general'
export interface ISettingGeneral {
    websiteName: string,
    logo: string,
    phone: string,
    email: string,
    address: string,
    copyRight: string 
}

const settingGeneralSchema = new Schema<ISettingGeneral>({
    websiteName: {type: String, required: true},
    logo: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
    copyRight: {type: String, required: true},

},{timestamps: true})

export default model(COLLECTION_SETTING_GENERAL_NAME,settingGeneralSchema)