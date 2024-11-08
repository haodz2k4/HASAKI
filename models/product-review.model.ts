
import { model, Schema } from "mongoose";
import { COLLECTION_PRODUCT_NAME } from "./product.model";
import { COLLECTION_USER_NAME } from "./user.model";

const COLLECTION_PRODUCT_REVIEW_NAME = 'product-review'
interface IProductReview {
    productId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    rating: number;
    comment: string;
    deleted: boolean;
}

export const productReviewSchema = new Schema<IProductReview>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: COLLECTION_PRODUCT_NAME,
        required: true 
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: COLLECTION_USER_NAME,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true 
    },
    comment: {
        type: String,
        required: true 
    },
    deleted: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true 
})

export default model(COLLECTION_PRODUCT_REVIEW_NAME, productReviewSchema)