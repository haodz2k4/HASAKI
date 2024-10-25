import { ObjectSchema } from "joi";

export interface SchemaValidation {
    body?: ObjectSchema<any>,
    params?: ObjectSchema<any>,
    query?: ObjectSchema<any>
}