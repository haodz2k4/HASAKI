import {Model, ObjectId, Schema, model, plugin, Document} from "mongoose"
import { isURL } from "validator"


export const COLLECTION_NAME = 'Product'
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

const productSchema = new Schema<IProduct>({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 200 
    },
    categoryId: {
        type: Schema.Types.ObjectId, ref: 'category',
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
        const count = await model(COLLECTION_NAME).countDocuments({ deleted: false });
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

productSchema.virtual('newPrice').get(function(): number {
    return this.price - (100 - this.discountPercentage) / 100
})


export default model<IProduct>(COLLECTION_NAME,productSchema)