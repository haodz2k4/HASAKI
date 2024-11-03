import productModel, { COLLECTION_PRODUCT_NAME } from './product.model';
import { Model, Schema, model} from "mongoose"
import supplierModel, { COLLECTION_SUPPLIER_NAME } from "./supplier.model"
export interface IIventory {
    productId: Schema.Types.ObjectId,
    supplierId: Schema.Types.ObjectId,
    quantity: number,
    wareHouse: string,
    deleted: boolean
}
export const COLLECTION_INVENTORY_NAME = 'Inventory' 
interface IInventoryModel extends Model<IIventory>{
    substractInventory(productId: string, quantity: number): Promise<void>;
}
const inventorySchema = new Schema<IIventory, IInventoryModel>({
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
inventorySchema.statics.substractInventory = async function(productId: string, quantity: number) {
    const inventories = await model<IIventory, IInventoryModel>(COLLECTION_INVENTORY_NAME).find({productId, deleted: false});
    for(const item of inventories){
        if(quantity === 0) {break};
        if(quantity < item.quantity){
            item.quantity -= quantity
            await item.save()
            quantity = 0;
        }else{
            quantity -= item.quantity
            item.quantity = 0;
            await item.save()
        }
    }
}



export default model<IIventory, IInventoryModel>(COLLECTION_INVENTORY_NAME,inventorySchema)