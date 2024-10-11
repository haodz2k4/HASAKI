
import { sortType } from './../utils/types/sort';
import productModel, {IProduct} from "../../models/product.model"
import { IPagination, IPaginationResult } from "../utils/types/pagination";
import { buildRegrex } from '../utils/regrex';
import { ApiError } from '../utils/error';
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

export const createProduct = async (product: IProduct) => {
    return await productModel.create(product);
}

export const findProductById = async (id: string) => {
    return await productModel.findOne({_id: id, deleted: false});
}

export const updateProductById = async (id: string, updateProduct: Partial<IProduct>) => {
    const product = await findProductById(id);
    if(!product){
        throw new ApiError(404,"Product is not found");
    }
    Object.assign(product, updateProduct);
    await product.save()
    return product
}
export const deleteProduct = async (id: string) => {
    return await updateProductById(id,{
        deleted: true
    })
}