import { Schema, model, Types } from 'mongoose';
import User from "../models/user.model";
import { COLLECTION_USER_NAME } from '../models/user.model';

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
    productIds: [{type: Schema.Types.ObjectId, ref: COLLECTION_FAVORITE_LIST_NAME}] 
})


export default model(COLLECTION_FAVORITE_LIST_NAME,favoriteListSChema)