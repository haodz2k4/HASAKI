import inventoryModel from "../models/inventory.model";

export const totalQuantity =async (productId: string): Promise<number> => {
    const inventories = await inventoryModel.find({productId, deleted: false});
    return inventories.reduce((result, item) => {
        result += item.quantity
        return result
    }, 0)
} 