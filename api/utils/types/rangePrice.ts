export type RangePrice = number | undefined | string 

export interface IRangePrice {
    price: {
        $gte?: RangePrice,
        $lte?: RangePrice
    }
}