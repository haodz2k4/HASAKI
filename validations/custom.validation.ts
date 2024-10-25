import { CustomHelpers } from "joi"
import { isValidObjectId } from "mongoose";


export const objectIdValidator =  (value: any, helpers: CustomHelpers) => {
    if (!isValidObjectId(value)) {
        return helpers.message({ custom: `"${value}" is not a valid ObjectId` });
    }
    return value;
};

export const manyObjectIdValidator = (value: string | string[], helpers: CustomHelpers) => {
    let ids: string[];
    if (typeof value === 'string') {
        try {
            ids = JSON.parse(value);
            if (!Array.isArray(ids)) {
                return helpers.message({ custom: `"${value}" should be an array of ObjectIds` });
            }
        } catch {
            return helpers.message({ custom: `"${value}" is not a valid JSON array of ObjectIds` });
        }
    } else {
        ids = value;
    }

    for (const id of ids) {
        if (!isValidObjectId(id)) {
            return helpers.message({ custom: `"${id}" is not a valid ObjectId` });
        }
    }

    return ids;
}