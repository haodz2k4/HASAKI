import { COLLECTION_PRODUCT_NAME } from './product.model';
import {ObjectId, Schema, model} from "mongoose"
import { COLLECTION_SUPPLIER_NAME } from "./supplier.model"
export interface IIventory {
    productId: ObjectId,
    supplierId: ObjectId,
    quantity: number,
    wareHouse: string,
    
}

const inventorySchema = new Schema<IIventory>({
    productId: {
        type: Schema.Types.ObjectId, 
        ref: COLLECTION_PRODUCT_NAME, 
        required: true,
        validate: {
            validator: async function(value: string) {
                const product = await model(COLLECTION_PRODUCT_NAME).findOne({_id: value, deleted: false})
                return !!product
            },
            message: 'product is not exists'
        }
    },
    supplierId: {
        type: Schema.Types.ObjectId, 
        ref: COLLECTION_SUPPLIER_NAME, 
        required: true,
        validate: {
            validator: async function(value: string) {
                const product = await model(COLLECTION_SUPPLIER_NAME).findOne({_id: value, deleted: false})
                return !!product
            },
            message: 'supplier is not exists'
        }
    },
    quantity: {type: Number, min: 0, default: 0},
    wareHouse: {type: String, required: true}

})


export default model<IIventory>('inventory',inventorySchema)