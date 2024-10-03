import Product, {IProduct} from "../models/product.model"

interface PriceRange {
    min?: number;
    max?: number;
}

interface Filter {
    status?: string;
    highlighted?: string;
    price?: PriceRange; // Range price
    keyword?: string;
    searchBy?: string;
}

interface ProductsQueryOption {
    limit?: number;
    skip?: number;
    filter?: Filter;
    sort?: Record<string, any>;
    selectFields?: string;
}

export const getAllProductsByQuery = async (option: ProductsQueryOption) => {
 
    const { filter, limit = 100, skip = 0, sort = {position: "desc"}, selectFields } = option;
    const { searchBy, keyword } = filter || {};
    const find: Record<string, any> = { ...filter, deleted: false };
    if (searchBy && keyword) {
        find[searchBy] = new RegExp(keyword, "i");
    } else if (keyword) {
        find.title = new RegExp(keyword, "i");
    }
    delete find.keyword
    return await Product
        .find(find)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .select(selectFields || "")
}

export const getTotalDocument = async (filter?: Filter): Promise<number> => {
    return await Product.countDocuments(filter)
}

export const getProductByid = async (id: string) => {
    return await Product.findOne({_id: id, deleted: false})
} 

export const getProductBySlug = async (slug: string) => {
    return await Product.findOne({slug,deleted: false}).populate('categoryId','title thumbnail')
}

export const updateProductById = async (id: string,productBody: Partial<IProduct>) => {
    const product = await getProductByid(id);
    if(!product){
        throw new Error("Product is not found")
    }
    Object.assign(product, productBody)
    await product.save() 
    return product
} 

export const createProduct = async (productBody: IProduct) => {
    
    return await Product.create(productBody);

}