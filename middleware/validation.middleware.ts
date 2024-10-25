import { NextFunction, Request, Response } from "express";
import Joi, { SchemaMap } from "joi";
import pick from "../utils/pick";
import { RenderError } from "../utils/error";


export default (schema: SchemaMap) => (req: Request, res: Response, next: NextFunction) => {
  
    const validSchema = pick(schema,['query','body','params']);
   
    const object = pick(req, Object.keys(validSchema) as any[]);

    const {value, error} = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object);
    console.log(value)
    if(error){
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return next(new RenderError(400, errorMessage))
    }
    Object.assign(req, value);
    next()
}