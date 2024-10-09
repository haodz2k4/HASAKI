import { model } from 'mongoose';
import slugify from 'slugify';
export const createSlug = (slug: string): string => {
    return slugify(slug,{strict: true, lower: true})
}
export const createUniqueSlug = async (data: string, collectionName: string): Promise<string> => {
    let initSlug = createSlug(data);
    let count = 0;
    while(await model(collectionName).findOne({data})) {
        initSlug = `${initSlug}-${count}`;
    }
    return initSlug
}