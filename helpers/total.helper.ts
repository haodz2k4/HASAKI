import { Types } from "mongoose";
import inventoryModel from "../models/inventory.model";
import orderModel from "../models/order.model";

export const totalQuantity =async (productId: string): Promise<number> => {
    const inventories = await inventoryModel.find({productId, deleted: false});
    return inventories.reduce((result, item) => {
        result += item.quantity
        return result
    }, 0)
} 

export const getTotalQuantityOfSoldByProductId = async (productId: string): Promise<number> => {

    const result = await orderModel.aggregate([
        { $unwind: "$products" },
        { $match: { "products.productId": new Types.ObjectId(productId) } },
        { $group: { _id: null, totalQuantity: { $sum: "$products.quantity" } } }
    ]);

    return result.length > 0 ? result[0].totalQuantity : 0;
   
}