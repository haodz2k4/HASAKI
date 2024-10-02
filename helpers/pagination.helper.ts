
export interface PaginationResult {
    page?: number;
    limit: number;
    skip?: number;
    countPage?: number;
    total?: number
}

export default (page: number, limit: number, total: number): PaginationResult => {
    const skip = (page - 1) * limit; 
    const countPage = Math.ceil(total / limit) 
    return {page, limit, skip, countPage, total}
}