import { sortType } from './../utils/types/sort';
import productModel, {IProduct} from "../../models/product.model"
import { IPagination } from "../utils/types/pagination";

interface IFilterProduct {
    status?: string;
    highlighted?: string;
    title?: string;
    categoryId?: string;
}
interface IQueryProduct extends Partial<IPagination> {
    filter?: IFilterProduct;
    sortKey?: keyof IProduct;
    sortValue?: sortType;
    selectFields?: string;
}

export const getProducts = async (queryProduct: IQueryProduct) => {
    const {
        filter, 
        sortKey = 'position', 
        sortValue = "desc", 
        selectFields = "",
        page = 1,
        limit = 30
    } = queryProduct;
    const skip = (page - 1) * limit;
    return await productModel.find({
        ...filter,
        deleted: false
    })
    .skip(skip)
    .limit(limit)
    .sort({[sortKey]: sortValue})
    .select(selectFields);
}