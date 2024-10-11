
export default <T extends Record<string, any>, K extends keyof T>(object: T, keys: K[]): Partial<T> => { 
    return keys.reduce((result, key) => {
        if (key in object) {
            result[key] = object[key];
        }
        return result;
    }, {} as Partial<T>);
}