import { Types, Schema, model } from "mongoose";
import Product from "../models/product.model"
import { COLLECTION_USER_NAME } from "./user.model";
import { COLLECTION_PRODUCT_NAME } from "./product.model";
export const COLLECTION_CART_NAME = 'Cart' 
export interface ICart {
    userId: Types.ObjectId,
    products: {
        productId: Types.ObjectId,
        quantity: number
    }[]
}

const cartSchema = new Schema<ICart>({
    userId: {type: Schema.Types.ObjectId, ref: COLLECTION_USER_NAME},
    products: {
        type: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: COLLECTION_PRODUCT_NAME,
                required: [true, 'Product ID is required'],
                validate: {
                    validator:async function(data):Promise<boolean> {
                        const product = await Product.findById({_id: data})
                        return !!product
                    },
                    message: 'Product is not exists'
                },
            },
            quantity: { type: Number, default: 1 },
        }],
        default: []
    }
})


export default model(COLLECTION_CART_NAME,cartSchema)