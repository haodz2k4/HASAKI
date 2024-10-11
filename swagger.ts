import swaggerJSDoc from "swagger-jsdoc";
import {SwaggerUiOptions } from "swagger-ui-express";

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'HASAKI',
        version: '1.0.0',
        description: 'TRANG WEB BÁN MỸ PHẨM SỐ MỘT VIỆT NAM',
      },
    },
    apis: [
        './models/*.ts',       
        './api/routers/*.ts',   
        './api/controllers/*.ts',   
      ],
  };
export const specs = swaggerJSDoc(options);