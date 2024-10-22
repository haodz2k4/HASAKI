
import { sortType } from './../utils/types/sort';
import productModel, {IProduct} from "../../models/product.model"
import { IPagination, IPaginationResult } from "../utils/types/pagination";
import { buildRegrex } from '../utils/regrex';
import pick from '../utils/pick';
import rangePriceHelper from '../helpers/range-price.helper';
import { NullableType } from '../utils/types/nullable';
import { ApiError } from '../utils/error';
interface IFilterProduct {
    status?: string;
    highlighted?: string;
    keyword?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
}
interface IQueryProduct extends Partial<IPagination> {
    filter?: IFilterProduct;
    sortKey?: keyof IProduct;
    sortValue?: sortType;
    selectFields?: string;
}

export const getProductBySlug = async (slug: string): Promise<NullableType<IProduct>> => {
    return await productModel.findOne({slug, deleted: false}).lean()
}

export const getProducts = async (queryProduct: IQueryProduct) => {
    const {
        filter = {}, 
        sortKey = 'position', 
        sortValue = "desc", 
        selectFields = "",
        page = 1,
        limit = 30
    } = queryProduct;
    const skip = (page - 1) * limit;
    const find: Record<string, unknown> = pick(filter,["status","highlighted","categoryId"]);
    const {keyword, minPrice, maxPrice} = filter;
    if(keyword){
        find.title = buildRegrex(keyword);
    }
    if(minPrice || maxPrice){
        find.$and =  rangePriceHelper(minPrice, maxPrice)
        
    }
   
    const [products, total] = await Promise.all([
        await productModel
        .find({...find,deleted: false })
        .skip(skip)
        .limit(limit)
        .sort({[sortKey]: sortValue})
        .select(selectFields)
        .lean(),
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

export const getTotalDocument = async (filter?: IFilterProduct): Promise<number> => {
    return await productModel.countDocuments(filter);
}

export const createProduct = async (product: IProduct) => {
    return await productModel.create(product);
}

export const findProductById = async (id: string): Promise<NullableType<IProduct>> => {
    return await productModel.findOne({_id: id, deleted: false}).lean();
}

export const updateProductById = async (id: string, updateProduct: Partial<IProduct>): Promise<IProduct> => {
    const product = await productModel.findOne({_id: id, deleted: false});
    if(!product){
        throw new ApiError(404,"Product is not found")
    }
    Object.assign(product, updateProduct);
    await product.save()
    return product
}
export const deleteProduct = async (id: string): Promise<void> => {
    await updateProductById(id,{
        deleted: true
    })
}