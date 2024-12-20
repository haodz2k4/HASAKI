
//INP: object<T>, fields: []K
//OUT: Record<T,any>
//req.query = {status: "active", age: 20, deleted: true}
//EXAMPLE: const filter = pick(req.query,["status","age"])
//RETURN: {status: "active", age: 20}
export default <T extends object, K extends keyof T>(object: T, keys: K[]): Partial<T> => { 
    return keys.reduce((result, key) => {
        if (key in object) {
            result[key] = object[key];
        }
        return result;
    }, {} as Partial<T>);
}


//INP: {status: "active"}
//OUT: "status-active"
export const stringObject = (obj: Record<string, any>): string => {
    const entries = Object.entries(obj);
    for(const item of entries){
        const [key, value] = item;
        return `${key}-${value}`
    }
    return ""
} 