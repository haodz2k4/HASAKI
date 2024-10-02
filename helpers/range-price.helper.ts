
export default (minPrice: number | undefined, maxPrice: number | undefined) => {
    const result = [];
    if(minPrice){
        result.push({price: {$gte: minPrice}})
    }
    if(maxPrice){
        result.push({price: {$lte: maxPrice}})
    }
    return result
}