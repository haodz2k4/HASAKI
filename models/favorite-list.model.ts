
import { Schema, model, Types, Model } from 'mongoose';
import User from "./user.model";
import { COLLECTION_USER_NAME } from './user.model';
import { COLLECTION_PRODUCT_NAME } from './product.model';

const COLLECTION_FAVORITE_LIST_NAME = 'Favorite-list'
interface IFavoriteList {
    userId: Types.ObjectId,
    productIds: Types.ObjectId[] 
}
interface IFavoriteListMethod {
    toggleFavoriteList(productId: string): void 
    addMultiFavorite(productIds: string[]): void 
}
type FavoriteListModel = Model<IFavoriteList, {}, IFavoriteListMethod>
const favoriteListSChema = new Schema<IFavoriteList, FavoriteListModel, IFavoriteListMethod>({
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

favoriteListSChema.methods.toggleFavoriteList = async function(productId: string) {
    
    const isExists = this.productIds.some((item: Record<string, any>) => item.id === productId);
    if(isExists){
        const index = this.productIds.findIndex((item: Record<string, any>) => item.id === productId);
        this.productIds.splice(index, 1)
    }else {
        this.productIds.push(new Types.ObjectId(productId))
    }
    await this.save()
}
favoriteListSChema.methods.addMultiFavorite = async function(productIds: string[]) {
    const newProductIds = productIds
        .map(id => new Types.ObjectId(id)) 
        .filter(id => !this.productIds.some(existingId => existingId.equals(id)));

        if (newProductIds.length > 0) {
            this.productIds.push(...newProductIds);
            await this.save(); 
        }
}


export default model<IFavoriteList, FavoriteListModel>(COLLECTION_FAVORITE_LIST_NAME,favoriteListSChema)