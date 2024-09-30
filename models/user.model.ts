import { Schema, model, Model } from "mongoose";
import {isURL, isMobilePhone, isEmail} from "validator"
import { compare, hash } from "bcrypt";

export interface IUser {
    _id: Schema.Types.ObjectId
    fullName: string;
    avatar: string;
    email: string;
    password: string;
    phone: string;
    birthDate: Date;
    gender: "nam" | "nữ";
    status: "active" | "inactive"
    deleted: boolean;
}


interface IUserMethod {
    isPasswordMatch(password: string): Promise<boolean>
}
type UserModel = Model<IUser, UserModel, IUserMethod>
const userSchema = new Schema<IUser,UserModel,IUserMethod>({
    fullName: {type: String, required: true},
    email: {
        type: String, 
        required: true,
        minlength: 6, 
        maxlength: 50, 
        unique: true,
        validate: {
            validator: function(val: string): boolean {
                return isEmail(val)
            },
            message: 'Invalid email'
        }
    },
    avatar: {
        type: String,
        validate: {
            validator: function(val: string): boolean {
                return isURL(val)
            },
            message: 'Invalid URL'
        }
    },
    password: {
        type: String, 
        required: true,
        minlength: 8,
        validate: {
            validator: function(value: string): boolean {
                if(!value.match(/\d/) || !value.match(/[a-zA-Z]/)){
                    return false 
                }
                return true
            },
            message: 'Password must contain at least one letter and one numbe'
        },
        select: false
    },
    phone: {
        type: String, 
        required: true,
        minlength: 8, 
        maxlength: 10,
        validate:{
            validator: function(val: string): boolean {
                return isMobilePhone(val)
            },
            message: 'Invalid Mobile From'
        }
    },
    birthDate: Date,
    gender: {type: String, enum: ["nam","nữ"]},
    status: {type: String, enum: ["active","inactive"], default: "active"},
    deleted: {
        type: Boolean,
        default: false
    }
},{timestamps: true}) 

userSchema.methods.isPasswordMatch = async function(password: string) :Promise<boolean> {
    return await compare(password,this.password)
} 

userSchema.pre('save', async function(next) {

    if(this.isModified('password')){
        this.password = await hash(this.password, 10)
    }

    next()
})


export default model<IUser,UserModel>('user',userSchema)