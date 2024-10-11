
import { RangePrice, IRangePrice } from "../utils/types/rangePrice"
export default (minPrice: RangePrice, maxPrice: RangePrice): IRangePrice[] => {
    const result: IRangePrice[] = [];
    if(minPrice) {
        result.push({
            price: {$gte: Number(minPrice)}
        })
    }
    if(maxPrice){
        result.push({
            price: {$lte: Number(maxPrice)}
        })
    }
    return result;
}