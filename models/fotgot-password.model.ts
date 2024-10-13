import { model, Schema, Types } from "mongoose";
import { COLLECTION_USER_NAME } from "./user.model";
import { hash } from "bcrypt";
export const COLLECTION_FORGOT_PASSWORD_NAME = 'forgot-password'

interface IForgotPassword {
    userId: Types.ObjectId,
    otp: string ,
    expireIn: Date,
    isUsed: boolean
}
const forgotPasswordSchema = new Schema<IForgotPassword>({
    userId: {type: Schema.Types.ObjectId, ref: COLLECTION_USER_NAME},
    otp: {type: String, required: true},
    expireIn: {type: Date, required: true, index: {expires: '5m'}},
    isUsed: {type: Boolean, default: false}

},{timestamps: true})

forgotPasswordSchema.pre('save',async function(next) {
    if(this.isModified('otp')){
        this.otp = await hash(this.otp, 10)
    }
    next()
})

export default model<IForgotPassword>(COLLECTION_FORGOT_PASSWORD_NAME, forgotPasswordSchema)