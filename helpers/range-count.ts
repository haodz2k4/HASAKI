
export default (field: string,min: number | undefined, max: number | undefined) => {
    const result = [];
    if(min){
        result.push({[field]: {$gte: min}})
    }
    if(max){
        result.push({[field]: {$lte: max}})
    }
    return result
}

export const rangeSize = (field: string,min: number | undefined, max: number | undefined) => {
    const result = [];
    if(min){
        result.push({
            $expr: {
                $gte: [
                    { $size: `$${field}` },
                    min
                ]
            }
        });
    }
    if(max){
        result.push({
            $expr: {
                $lte: [
                    { $size: `$${field}` },
                    max
                ]
            }
        });
    }
    return result
}