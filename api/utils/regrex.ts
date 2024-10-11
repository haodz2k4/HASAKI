
export const buildRegrex = (keyword: string): RegExp => {
    return new RegExp(keyword,"i");
}