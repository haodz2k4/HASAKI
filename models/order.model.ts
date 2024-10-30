import { model, Schema } from "mongoose";
import { COLLECTION_USER_NAME, IUserAddress } from "./user.model";
import { COLLECTION_PRODUCT_NAME } from "./product.model";

const COLLECTION_ORDER_NAME = 'Orders';
interface IOrderProduct {
    productId: Schema.Types.ObjectId,
    quantity: number,
    price: number,
    discountPercentage: number
}
interface IOrder {
    userId: Schema.Types.ObjectId;
    status: string;
    products: IOrderProduct;
    address: IUserAddress
}
const orderSchema = new Schema<IOrder>({
    userId: {type: Schema.Types.ObjectId, ref: COLLECTION_USER_NAME},
    status: {type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled','issue']},
    products: {
        type: {
            productId: {type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_NAME},
            price: {type: Number, min: 0},
            discountPercentage: {type: Number, min: 0, max: 100},
            quantity: {type: Number, min: 1}
        },
        required: true
    },
    address: {
        type: {
                city: {type: String, required: true}, 
                street: {type: String, required: true}, 
                country: {type: String, required: true}
            },
        required: true 
    }
})

export default model<IOrder>(COLLECTION_ORDER_NAME, orderSchema)