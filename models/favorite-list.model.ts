import { Schema, model, Types } from 'mongoose';
import User from "./user.model";
import { COLLECTION_USER_NAME } from './user.model';
import { COLLECTION_PRODUCT_NAME } from './product.model';

const COLLECTION_FAVORITE_LIST_NAME = 'Favorite-list'
interface IFavoriteList {
    userId: Types.ObjectId,
    productIds: Types.ObjectId[] 
}

const favoriteListSChema = new Schema<IFavoriteList>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: COLLECTION_USER_NAME,
        validate: {
            validator: async function(val) {
                const user = await User.findOne({_id: val, deleted: false})
                return !!user 
            },
            message: 'User is not found'
        }
    },
    productIds: {
        type: [{type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_NAME}],
        default: [] 
    }
})


export default model(COLLECTION_FAVORITE_LIST_NAME,favoriteListSChema)