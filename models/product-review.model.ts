
import { Model, model, Schema } from "mongoose";
import { COLLECTION_PRODUCT_NAME } from "./product.model";
import { COLLECTION_USER_NAME } from "./user.model";
import { COLLECTION_ORDER_NAME } from "./order.model";

const COLLECTION_PRODUCT_REVIEW_NAME = 'product-review'
interface IProductReview {
    productId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    orderId: Schema.Types.ObjectId;
    rating: number;
    comment: string;
    deleted: boolean;
}

interface IProductReviewModel extends Model<IProductReview> {
    countRating(productId: string): Promise<number>;
    averageRating(productId: string): Promise<number>;
}

export const productReviewSchema = new Schema<IProductReview, IProductReviewModel>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true 
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: COLLECTION_USER_NAME,
        required: true
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: COLLECTION_ORDER_NAME,
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

productReviewSchema.statics.countRating = async function(productId: string) :Promise<number> {
    return await model<IProductReview, IProductReviewModel>(COLLECTION_PRODUCT_REVIEW_NAME).countDocuments({productId})
}
productReviewSchema.statics.averageRating = async function(productId: string): Promise<number> {
    const productReviews = await model<IProductReview, IProductReviewModel>(COLLECTION_PRODUCT_REVIEW_NAME).find({productId})
    const totalRating = productReviews.reduce((result, item) => {
        result += item.rating
        return result
    }, 0)
    if(productReviews.length === 0){
        return 0;
    }
    return totalRating / productReviews.length
}


export default model<IProductReview, IProductReviewModel>(COLLECTION_PRODUCT_REVIEW_NAME, productReviewSchema)