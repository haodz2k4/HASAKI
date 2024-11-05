import supplierModel from "../../models/supplier.model"
import { IPagination, IPaginationResult } from "../utils/types/pagination";
import { sortType } from "../utils/types/sort";

interface IFilterSupplier {
    status?: string;
    keyword?: string;
}
interface IQuerySupplier extends Partial<IPagination>{
    filter?: IFilterSupplier;
    sortKey?: string;
    sortValue?: sortType;
    selectFields?: string;
}
export const getSuppliers = async (querySupplier: IQuerySupplier = {}) => {
    const {filter = {}, sortKey = 'createdAt', sortValue = 'desc', selectFields = '', page = 1, limit = 10} = querySupplier;
    const skip = (page - 1) * limit 
    const find = {...handleFilter(filter), deleted: false}
    const [suppliers, total] = await Promise.all([
        supplierModel
            .find(find)
            .sort({[sortKey]: sortValue})
            .skip(skip)
            .limit(limit)
            .select(selectFields),
        getTotalDocument(filter)
    ])
    const pageSize = Math.ceil(total / limit)
    const pagination: IPaginationResult = {
        currentPage: page,
        limit,
        pageSize,
        total
    }
    return {
        suppliers,
        pagination
    }

}
const handleFilter = (filter: IFilterSupplier = {}) => {
    const {keyword, status} = filter;
    const find: Record<string, any>  = {}
    if(keyword){
        find["$or"] = [
            {name: new RegExp(keyword,"i")},
            {'contactInfo.email': new RegExp(keyword,"i")},
            {'contactInfo.phone': new RegExp(keyword,"i")},
            {'contactInfo.address': new RegExp(keyword,"i")}
        ]
    }
    if(status){
        find.status = status
    }

    return find
}
export const getTotalDocument = async (filterSupplier?: IFilterSupplier) => {
    const filter = handleFilter(filterSupplier)
    return await supplierModel.countDocuments(filter)
}