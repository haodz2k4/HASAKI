export interface IPagination {
    page: number;
    limit: number;
}

export interface IPaginationResult {
    currentPage: number;
    limit: number;
    pageSize: number;
    total: number;

}