
export interface PaginationResult {
    page?: number;
    limit: number;
    skip?: number;
    countPage?: number;
    total?: number
}

interface PaginationOptions {
    page: number;
    limit: number;
    total: number
}

export default (pagination: PaginationOptions): PaginationResult => {
    const {page, limit, total} = pagination
    const skip = (page - 1) * limit; 
    const countPage = Math.ceil(total / limit) 
    return {page, limit, skip, countPage, total}
}