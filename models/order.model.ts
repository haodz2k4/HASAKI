import { model, Schema } from "mongoose";
import { COLLECTION_USER_NAME, IUserAddress } from "./user.model";
import inventoryModel from "./inventory.model";

export const COLLECTION_ORDER_NAME = 'Orders';
export interface IOrderProduct {
    productId: Schema.Types.ObjectId;
    quantity: number;
    price: number;
    discountPercentage: number;
    canRating?: boolean
}

export interface IOrderUser {
    userId: Schema.Types.ObjectId,
    email: string;
    phone: string;
    address: IUserAddress;
}
export interface IOrder {
    user: IOrderUser;
    status: string;
    paymentMethod: string;
    products: IOrderProduct[];
    shippingCost: number;
    isConfirmed: boolean;
    deleted: boolean;
}


const orderSchema = new Schema<IOrder>({
    user: {
        type: {
            userId: {type: Schema.Types.ObjectId,ref: COLLECTION_USER_NAME, required: true},
            email: {type: String, required: true},
            phone: {type: String, required: true},
            address: {
                type: {
                    street: {type: String, required: true},
                    city: {type: String, required: true},
                    country: {type: String, required: true}
                }, 
                required: true
            }
        }
    },
    status: {type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled','issue'], default: 'pending'},
    paymentMethod: {type: String, enum: ['cash_on_delivery','card_payment'], required: true},
    products: {
        type: [{
            productId: {type: Schema.Types.ObjectId, ref: 'Product'},
            price: {type: Number, min: 0},
            discountPercentage: {type: Number, min: 0, max: 100},
            quantity: {type: Number, min: 1}
        }],
        required: true
    },
    shippingCost: {
        type: Number,
        default: 20000,
        min: 0,
        max: 100000
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean, 
        default: false
    }
},{
    timestamps: true
})
orderSchema.pre('save',async function(next) {
    if(this.isNew){
        for(const item of this.products){
            console.log(item.quantity)
            await inventoryModel.substractInventory(item.productId.toString(), item.quantity)
        }
       
    }
    next()
})
orderSchema.virtual('totalPrice').get(function() {
    let total = 0
    this.products.forEach((item) => {
        total += (item.price * (100 - item.discountPercentage) / 100) * item.quantity 
    })
    total += this.shippingCost
    return total
})

export default model<IOrder>(COLLECTION_ORDER_NAME, orderSchema)    