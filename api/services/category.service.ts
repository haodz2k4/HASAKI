import categoryModel, { ICategory } from "../../models/category.model";
import { ApiError } from "../utils/error";
import pick from "../utils/pick";
import { IPagination, IPaginationResult } from "../utils/types/pagination";
import { sortType } from "../utils/types/sort";

interface IFilterCategory {
    status?: string;
    keyword?: string;
    searchBy?: string
}
interface IQueryCategory extends IPagination {
    filter: IFilterCategory;
    sortKey?: string;
    sortValue?: sortType;
    selectFields?: string; 
}

export const createCategory = async (category: ICategory) => {
    return await categoryModel.create(category);
}

export const getCategoryById = async (id: string) => {
    return await categoryModel.findOne({_id: id, deleted: false})
}

export const getCategories = async (queryCategory: IQueryCategory) => {
    const {
        page = 1,
        limit = 10,
        filter,
        sortKey = "createdAt",
        sortValue = "desc",
        selectFields = ""
    } = queryCategory;
    const find: Record<string,unknown> = pick(filter,["status","keyword","searchBy"])
    const {keyword, searchBy = "title"} = filter;
    if(keyword){
        find[searchBy] = keyword
    }
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
        categoryModel
            .find({...find,deleted: false})
            .skip(skip)
            .sort({[sortKey]: sortValue})
            .select(selectFields),
        getTotalDocument()
    ])
    const pageSize = Math.ceil(total / limit);
    const pagination: IPaginationResult = {
        currentPage: page,
        limit,
        pageSize,
        total

    }
    return {
        categories,
        pagination
    }
}

export const getTotalDocument = async (filter?: IFilterCategory): Promise<number> =>{
    return await categoryModel.countDocuments(filter)
}

export const getCategoryBySlug = async (slug: string) => {
    return await categoryModel.findOne({slug, deleted: false});

}

export const updateCategory = async (id: string, updateCategory: Partial<ICategory>) => {
    const category = await getCategoryById(id);
    if(!category){
        throw new ApiError(404,"Category is not found")
    }
    Object.assign(category, updateCategory)
    await category.save()
    return category 
}

export const deleteCategory = async (id: string): Promise<void> => {
    await updateCategory(id,{
        deleted: true 
    })
}