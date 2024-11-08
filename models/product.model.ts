
import { ObjectId, Schema, model} from "mongoose"
import { isURL } from "validator"
import categoryModel, { COLLECTION_CATEGORY_NAME } from "./category.model"
import { createUniqueSlug } from "../helpers/slug"
import { getTotalQuantityOfSoldByProductId, totalQuantity } from "../helpers/total.helper"
import productReviewModel from "./product-review.model"
export const COLLECTION_PRODUCT_NAME = 'Product'
export interface IProduct {
    _id?: string 
    title: string
    categoryId: ObjectId
    description?: string
    highlighted?: string
    position?: number 
    thumbnail?: string[] 
    price: number
    discountPercentage: number 
    deleted?: boolean
    slug?: string
    status?: string
    newPrice?: number
    quantity?: number
    sold?: number;
    countRating?: number;
    averageRating?: number

}

export const productSchema = new Schema<IProduct>({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 200 
    },
    categoryId: {
        type: Schema.Types.ObjectId, 
        ref: COLLECTION_CATEGORY_NAME,
        validate: async function(val: string): Promise<boolean> {
            const category = await categoryModel.findOne({_id: val, deleted: false})
            return !!category
        },
        required: true 
    },  
    position: {type: Number, min: 1},
    description: String,
    highlighted: {type: String, enum: ["0","1"],default: "0"},
    thumbnail: {
        type: [String], 
        validate: {
            validator:  async function(v: string[]) {
                const length = (await Promise.all(v.map(item => isURL(item)))).length;
                return length === v.length;
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
    return this.price * (100 - this.discountPercentage) / 100
}) 
productSchema.post('find', async function (docs) {

    if(docs.length > 0) {
        for(const item of docs){
            item.quantity = await totalQuantity(item.id)
            item.sold = await getTotalQuantityOfSoldByProductId(item.id)
            item.countRating = await productReviewModel.countRating(item.id);
            item.averageRating = await productReviewModel.averageRating(item.id) 
        }
    }
    
});
productSchema.post('findOne', async function (doc) {
    if(doc){
        doc.quantity = await totalQuantity(doc.id)
        doc.sold = await getTotalQuantityOfSoldByProductId(doc.id)
        doc.countRating = await productReviewModel.countRating(doc.id);
        doc.averageRating = await productReviewModel.averageRating(doc.id) 
    }
})

productSchema.pre('save',async function(next) {
    //create unique slug 
    if(this.isModified('title')){
        this.slug = await createUniqueSlug(this.title, COLLECTION_PRODUCT_NAME);
    }
    //default position
    if(!this.position && this.isNew){
        this.position = await model<IProduct>(COLLECTION_PRODUCT_NAME).countDocuments({ deleted: false })
    }
    next()
})
export default model<IProduct>(COLLECTION_PRODUCT_NAME,productSchema)