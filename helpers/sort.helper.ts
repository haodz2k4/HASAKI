type SortValue = "asc" | "desc"

interface ISortResult {
    [key: string]: SortValue
}
interface OptionSort {
    defaultKey: string;
    defaultValue: SortValue
}
export default (sortKey: string = "createdAt", sortValue: "asc" | "desc" = "desc", optionSort?: OptionSort): ISortResult => {
    if(optionSort){
        const {defaultKey, defaultValue} = optionSort;
        sortKey = defaultKey
        sortValue = defaultValue
    }
    return {
        [sortKey]: sortValue
    }

    
}