import {Model, ObjectId, Schema, model, plugin, Document} from "mongoose"
import { isURL } from "validator"
import { COLLECTION_CATEGORY_NAME } from "./category.model"
import { formatPrice } from "../utils/format.utils"
export const COLLECTION_PRODUCT_NAME = 'Product'
export interface IProduct extends Document{
    id: string 
    title: string
    categoryId: ObjectId
    description: string
    highlighted: string
    position?: number 
    thumbnail: string 
    price: number
    discountPercentage: number 
    deleted: boolean
    slug: string
    status: string
    quantity?: number

}

export const productSchema = new Schema<IProduct>({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 200 
    },
    categoryId: {
        type: Schema.Types.ObjectId, ref: COLLECTION_CATEGORY_NAME,
        required: true,
        validate: {
            validator: async function(val: string) {
                const category = await model('category').findOne({_id: val, deleted: false})
                return category !!
            },
            message: 'category is not exists',
        },
        
    },  
    position: {type: Number, min: 1, default: async function():Promise<number> {
        const count = await model(COLLECTION_PRODUCT_NAME).countDocuments({ deleted: false });
        return count + 1
    }},
    description: String,
    highlighted: {type: String, enum: ["0","1"],default: "0"},
    thumbnail: {
        type: String, 
        validate: {
            validator: function(v: string) {
                return isURL(v)
            },
            message: 'invalid thumbnail'
        }
    },
    price: {type: Number, min: [0,'Minimum price is 0']},
    discountPercentage: {type: Number, min: [0,'Minimum discountPercentage is 0'], max: [100,'Maxium discountPercentage is 100']},
    deleted: {type: Boolean, default: false},
    slug: {type: String, unique: true},
    status: {type: String, enum: {values: ["active","inactive"],message: 'Status must be either "active" or "inactive"'}},


},{
    timestamps: true
})

productSchema.virtual('oldPrice').get(function(): string {
    return formatPrice(this.price)
})
productSchema.virtual('newPrice').get(function(): string {
    return formatPrice(this.price - (100 - this.discountPercentage) / 100)
})
export default model<IProduct>(COLLECTION_PRODUCT_NAME,productSchema)