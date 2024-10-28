// user.model.ts
import { Schema, model, Document, Model } from "mongoose";
import { isURL, isMobilePhone, isEmail } from "validator";
import { compare, hash } from "bcrypt";

interface IUserAddress {
    street: string;
    city: string;
    country: string 
}
export interface IUser {
    fullName: string;
    avatar: string;
    email: string;
    password: string;
    phone: string;
    birthDate: Date;
    gender: "nam" | "nữ";
    status: "active" | "inactive";
    addresses: IUserAddress[];
    defaultAddressIndex: number;
    deleted: boolean;
    isVerified: boolean;
}

export interface IUserMethods {
    isPasswordMatch(password: string): Promise<boolean>;
}
export const COLLECTION_USER_NAME = 'User'

export interface IUserDocument extends IUser, IUserMethods, Document {}


const userSchema = new Schema<IUserDocument, Model<IUserDocument>, IUserMethods>({
    fullName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50,
        unique: true,
        validate: {
            validator: function (val: string): boolean {
                return isEmail(val);
            },
            message: 'Invalid email'
        }
    },
    avatar: {
        type: String,
        validate: {
            validator: function (val: string): boolean {
                return isURL(val);
            },
            message: 'Invalid URL'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (value: string): boolean {
                return /\d/.test(value) && /[a-zA-Z]/.test(value);
            },
            message: 'Password must contain at least one letter and one number'
        },
        select: false
    },
    phone: {
        type: String,
        minlength: 8,
        maxlength: 10,
        validate: {
            validator: function (val: string): boolean {
                return isMobilePhone(val, 'vi-VN');
            },
            message: 'Invalid Mobile Form'
        }
    },
    addresses: {
        type: [
            {
                city: String, 
                street: String, 
                country: String
            }
        ],
        default: []
    },
    defaultAddressIndex: {type: Number, default: 0},
    birthDate: { type: Date },
    gender: { type: String, enum: ["nam", "nữ"] },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isVerified: {type: Boolean, default: false},
    deleted: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
    return await compare(password, this.password);
};

userSchema.pre<IUserDocument>('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hash(this.password, 10);
    }
    next();
});

export default model<IUserDocument>(COLLECTION_USER_NAME, userSchema);
