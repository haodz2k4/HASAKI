import Product, {IProduct} from "../models/product.model"


interface ProductsQueryOption {
    limit?: number;
    skip?: number;
    filter?: Record<string, any>;
    sort?: Record<string, "asc" | "desc">;
    selectFields?: string;
}

export const getAllProductsByQuery = async (option: ProductsQueryOption) => {
    const {filter, limit = 100, skip = 0, sort = {position: "desc"}, selectFields} = option 
    
    return await Product
        .find({...filter,deleted: false})
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .select(selectFields || "")
}

export const getTotalDocument = async (query?: Partial<Record<keyof IProduct, any>>): Promise<number> => {
    return await Product.countDocuments(query)
}

export const getProductByid = async (id: string) => {
    return await Product.findOne({_id: id, deleted: false})
} 

export const getProductBySlug = async (slug: string) => {
    return await Product.findOne({slug,deleted: false}).populate('categoryId','title thumbnail')
}

// export const updateProductById = async (id: string,productBody: Partial<IProduct>) => {
//     const product = await getProductByid(id);
//     Object.assign(product, productBody)
//     await product.save() 
//     return product
// } 

export const createProduct = async (productBody: IProduct) => {
    
    return await Product.create(productBody);

}