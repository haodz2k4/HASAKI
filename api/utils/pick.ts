
export default <T extends object, K extends keyof T>(object: T, keys: K[]): Partial<T> => { 
    return keys.reduce((result, key) => {
        if (key in object) {
            result[key] = object[key];
        }
        return result;
    }, {} as Partial<T>);
}


