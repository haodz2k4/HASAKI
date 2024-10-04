import swaggerJSDoc from "swagger-jsdoc";
import {SwaggerUiOptions } from "swagger-ui-express";

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Swagger Express API',
        version: '1.0.0',
        description: 'A simple Express API with Swagger documentation',
      },
    },
    apis: [
        './models/*.ts',       
        './api/routers/*.ts',   
        './api/handler/*.ts',   
      ],
  };
export const specs = swaggerJSDoc(options);