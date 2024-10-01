import { Types, Schema, model } from "mongoose";
import Product from "../models/product.model"
export interface ICart {
    userId: Types.ObjectId,
    products: {
        productId: Types.ObjectId,
        quantity: number
    }[]
}

const cartSchema = new Schema<ICart>({
    userId: {type: Schema.Types.ObjectId, ref: 'user'},
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product ID is required'],
            validate: {
                validator:async function(data):Promise<boolean> {
                    const product = await Product.findById({_id: data})
                    return !!product
                },
                message: 'Product is not exists'
            },
        },
        quantity: { type: Number, default: 1 }
    }]
})


export default model('cart',cartSchema)