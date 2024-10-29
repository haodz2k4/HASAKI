import { model, Schema } from "mongoose";
import { COLLECTION_USER_NAME } from "./user.model";
import { COLLECTION_PRODUCT_NAME } from "./product.model";

const COLLECTION_ORDER_NAME = 'Orders';
interface IOrderProduct {
    productId: Schema.Types.ObjectId,
    quantity: number
}
interface IOrder {
    userId: Schema.Types.ObjectId;
    status: string;
    products: IOrderProduct;
    addressIndex: number
}
const orderSchema = new Schema<IOrder>({
    userId: {type: Schema.Types.ObjectId, ref: COLLECTION_USER_NAME},
    status: {type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled','issue']},
    products: {
        type: {
            productId: {type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_NAME},
            quantity: {type: Number, min: 1}
        },
        required: true
    },
    addressIndex: {type: Number,required: true}
})

export default model<IOrder>(COLLECTION_ORDER_NAME, orderSchema)