import {ObjectId, Schema, model} from "mongoose"

export interface IIventory {
    productId: ObjectId,
    supplierId: ObjectId,
    quantity: number,
    wareHouse: string,
    
}

const inventorySchema = new Schema<IIventory>({
    productId: {
        type: Schema.Types.ObjectId, 
        ref: 'product', 
        required: true,
        validate: {
            validator: async function(value: string) {
                const product = await model('product').findOne({_id: value, deleted: false})
                return !!product
            },
            message: 'product is not exists'
        }
    },
    supplierId: {
        type: Schema.Types.ObjectId, 
        ref: 'supplier', 
        required: true,
        validate: {
            validator: async function(value: string) {
                const product = await model('supplier').findOne({_id: value, deleted: false})
                return !!product
            },
            message: 'supplier is not exists'
        }
    },
    quantity: {type: Number, min: 0, default: 0},
    wareHouse: {type: String, required: true}

})


export default model<IIventory>('inventory',inventorySchema)