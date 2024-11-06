import { Model, model, Schema } from "mongoose";
import { compare, hash } from "bcrypt";
export const COLLECTION_FORGOT_PASSWORD_NAME = 'forgot-password'

interface IForgotPassword {
    email: string; 
    otp: string;
    expireIn: Date;
    isUsed: boolean;
}

interface IForgotPasswordMethod {
    isMatchOtp(otp: string): Promise<boolean>
}
type ForgotPasswordModel = Model<IForgotPassword,{} ,IForgotPasswordMethod> 
const forgotPasswordSchema = new Schema<IForgotPassword, ForgotPasswordModel, IForgotPasswordMethod>({
    email: {type: String, required: true},
    otp: {type: String, required: true},
    expireIn: {type: Date,required: true, expires: 5},
    isUsed: {type: Boolean, default: false}

},{timestamps: true})

forgotPasswordSchema.pre('save',async function(next) {
    if(this.isModified('otp')){
        this.otp = await hash(this.otp, 10)
    }
    next()
})
forgotPasswordSchema.methods.isMatchOtp = async function(otp): Promise<boolean> {
    return await compare(otp, this.otp)
}
export default model<IForgotPassword, ForgotPasswordModel>(COLLECTION_FORGOT_PASSWORD_NAME, forgotPasswordSchema)