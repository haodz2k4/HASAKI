import productModel, { COLLECTION_PRODUCT_NAME } from './product.model';
import { Schema, model} from "mongoose"
import supplierModel, { COLLECTION_SUPPLIER_NAME } from "./supplier.model"
export interface IIventory {
    productId: Schema.Types.ObjectId,
    supplierId: Schema.Types.ObjectId,
    quantity: number,
    wareHouse: string,
    deleted: boolean
}
export const COLLECTION_INVENTORY_NAME = 'Inventory'

const inventorySchema = new Schema<IIventory>({
    productId: {
        type: Schema.Types.ObjectId, 
        
        required: true,
        validate: {
            validator: async function(value: Schema.Types.ObjectId) {
                const product = await productModel.findOne({_id: value, deleted: false})
                return !!product
            },
            message: 'product is not exists'
        },
        ref: COLLECTION_PRODUCT_NAME ?COLLECTION_PRODUCT_NAME : "Product", 
    },
    supplierId: {
        type: Schema.Types.ObjectId, 
        ref: COLLECTION_SUPPLIER_NAME, 
        required: true,
        validate: {
            validator: async function(value: Schema.Types.ObjectId) {
                const product = await supplierModel.findOne({_id: value, deleted: false})
                return !!product
            },
            message: 'supplier is not exists'
        }
    },
    quantity: {type: Number, min: 0, default: 0},
    wareHouse: {type: String, required: true},
    deleted: {
        type: Boolean,
        default: false
    }

})


export default model<IIventory>(COLLECTION_INVENTORY_NAME,inventorySchema)