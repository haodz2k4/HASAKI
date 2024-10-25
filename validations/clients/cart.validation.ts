import Joi from "joi";
import { SchemaValidation } from "../../utils/types/validation.type";
import { manyObjectIdValidator, objectIdValidator } from "../custom.validation";
import productModel from "../../models/product.model";


//[POST] "/cart/add/:productId"
export const add = {
    body: Joi.object().keys({
        quantity: Joi.number().integer().min(1).default(1),
    }),
    params: Joi.object().keys({
        productId: Joi.string().required().custom(objectIdValidator).custom(async (value: any, helpers: Joi.CustomHelpers<any>) => {
            const product = await productModel.findOne({_id: value});
            if(!product){
                return helpers.message({custom: `${value} is not found`})
            }
            if(product.status === 'inactive'){
                return helpers.message({custom: 'product is inactive'})
            }
            console.log(product)
            console.log(product.quantity)
            if(product.quantity === 0) {
                return helpers.message({custom: 'The product is out of stock'})
            }
            const quantity = helpers.state.ancestors[0].quantity 
            if(product.quantity && product.quantity < quantity){
                return helpers.message({custom: 'The quantity requested exceeds the quantity that exists'})
            }
            return value
        })
    })
    
}


//[DELETE] "/cart/remove/:productId"
export const removeProductFormcart = {
    params: Joi.object().keys({
        productId: Joi.string().required().custom(objectIdValidator)
    })
}

//[PATCH] "/cart/update/multi/:type"
export const updateMulti = {
    params: Joi.object().keys({
        type: Joi.string().valid('remove','order','favorite')
    }),
    body: Joi.object().keys({
        ids: Joi.string().required().custom(manyObjectIdValidator)
    })
}
