import { model, Schema } from "mongoose";
import { COLLECTION_USER_NAME, IUserAddress } from "./user.model";
import { COLLECTION_PRODUCT_NAME } from "./product.model";

const COLLECTION_ORDER_NAME = 'Orders';
export interface IOrderProduct {
    productId: Schema.Types.ObjectId,
    quantity: number,
    price: number,
    discountPercentage: number
}
export interface IOrder {
    userId: Schema.Types.ObjectId;
    status: string;
    paymentMethod: string;
    products: IOrderProduct[];
    address: IUserAddress;
    shippingCost: number;
    deleted: boolean;
}
const orderSchema = new Schema<IOrder>({
    userId: {type: Schema.Types.ObjectId, ref: COLLECTION_USER_NAME},
    status: {type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled','issue'], default: 'pending'},
    paymentMethod: {type: String, enum: ['cash_on_delivery','card_payment'], required: true},
    products: {
        type: [{
            productId: {type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_NAME},
            price: {type: Number, min: 0},
            discountPercentage: {type: Number, min: 0, max: 100},
            quantity: {type: Number, min: 1}
        }],
        required: true
    },
    address: {
        type: {
                city: {type: String, required: true}, 
                street: {type: String, required: true}, 
                country: {type: String, required: true}
            },
        required: true 
    },
    shippingCost: {
        type: Number,
        default: 20000,
        min: 0,
        max: 100000
    },
    deleted: {
        type: Boolean, 
        default: false
    }
})

orderSchema.virtual('totalPrice').get(function() {
    let total = 0
    this.products.forEach((item) => {
        total += (item.price * (100 - item.discountPercentage) / 100)
    })
    total += this.shippingCost
    return total
})
export default model<IOrder>(COLLECTION_ORDER_NAME, orderSchema)