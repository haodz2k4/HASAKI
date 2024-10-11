
import { sortType } from './../utils/types/sort';
import productModel, {IProduct} from "../../models/product.model"
import { IPagination, IPaginationResult } from "../utils/types/pagination";
import { buildRegrex } from '../utils/regrex';
interface IFilterProduct {
    status?: string;
    highlighted?: string;
    keyword?: string;
    categoryId?: string;
    title?: RegExp;
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
    if(filter?.keyword) {
        filter.title = buildRegrex(filter.keyword);
        delete filter.keyword
    }
    const [products, total] = await Promise.all([
        await productModel
        .find({...filter,deleted: false })
        .skip(skip)
        .limit(limit)
        .sort({[sortKey]: sortValue})
        .select(selectFields),
        await getTotalDocument(filter)
    ])
    const pageSize = Math.ceil(total / limit);
    const pagination: IPaginationResult = {
        currentPage: page,
        limit,
        pageSize,
        total
    }
    return {
        products,
        pagination
    }
}

export const getTotalDocument = async (filter?: IFilterProduct) => {
    return await productModel.countDocuments(filter);
}