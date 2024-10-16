
import { Schema,model } from "mongoose";
import {isURL, isEmail, isMobilePhone} from 'validator'
import {hash, compare} from "bcrypt"
import { COLLECTION_ROLE_NAME } from './role.model';

export const COLLECTION_ACCOUNT_NAME ='Account'

export interface IAccount {
    fullName: string
    description: string
    avatar: string
    email: string
    password: string
    phone: string
    roleId: Schema.Types.ObjectId
    birthDate: Date
    deleted: boolean
    status: string 
}
interface IAccountMethod  {
    isMatchPassword(password: string) :Promise<boolean>
}
const accountSchema = new Schema<IAccount, {}, IAccountMethod>({
    fullName: {type: String, required: true, min: 3, max: 20},
    description: String,
    avatar: {
        type: String,
        validate: {
            validator:  function(val: string) {
                if(val){
                    return isURL(val)
                }
                return true 
            },
            message: "Invalid url avatar"
        }
    },
    email: {
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function(val: string) {
                return isEmail(val)
            },
            message: "Invalid email"
        }
    },
    password: {
        type: String, 
        required: true,
        minlength: 8,
        select: false,
        validate: {
            validator: function(value: string) {
                if(!value.match(/\d/) || !value.match(/[a-zA-Z]/)){
                    return false 
                }
                return true
            },
            message: 'Password must contain at least one letter and one numbe'
        }
    },
    phone: {
        type: String, 
        required: true,
        validate: {
            validator: function(val: string) {
                return isMobilePhone(val)
            },
            message: 'phone is not valid'
        }
    },
    roleId: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: COLLECTION_ROLE_NAME,
        validate: {
            validator: async function(val: string) {
                const role = await model(COLLECTION_ROLE_NAME).findOne({_id: val},{deleted: false})
                return !!role
            },
            message: "Role is not exists"
        }
    },
    birthDate: Date,
    deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active","inactive"],
        default: "active"
    }
},{timestamps: true}) 


accountSchema.pre('save',async function(next) {
    if(this.isModified('password')) {
        this.password = await hash(this.password,8)
    } 
    next()
})
accountSchema.methods.isMatchPassword = function (password: string): Promise<boolean> {
    return compare(password, this.password)
}

export default model(COLLECTION_ACCOUNT_NAME,accountSchema)