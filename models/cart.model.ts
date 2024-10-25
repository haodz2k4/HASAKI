import { Types, Schema, model } from "mongoose";
import Product from "../models/product.model"
import { COLLECTION_USER_NAME } from "./user.model";
import { COLLECTION_PRODUCT_NAME } from "./product.model";
import { RenderError } from "../utils/error";
export const COLLECTION_CART_NAME = 'Cart' 

export interface IProductCart {
    productId: Types.ObjectId,
    quantity: number
}
export interface ICart {
    userId: Types.ObjectId,
    products: IProductCart[]
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
                    validator:async function(id):Promise<boolean> {
                        const product = await Product.findById({_id: id});
                        if(!product){
                            throw new RenderError(400,"Sản phẩm không tìm thấy")
                        }
                        return true;
                    },
                    message: 'Invalid product id'
                },
            },
            quantity: { type: Number, default: 1 },
        }],
        default: []
    }
})


export default model(COLLECTION_CART_NAME,cartSchema)