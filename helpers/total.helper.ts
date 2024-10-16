import inventoryModel from "../models/inventory.model";

export const totalQuantity =async (productIds: string[]): Promise<number> => {
    const inventories = await inventoryModel.find({productId: {$in: productIds}, deleted: false});
    return inventories.reduce((result, item) => {
        result += item.quantity
        return result
    }, 0)
} 