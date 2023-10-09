import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from 'swagger-ui-express';


// Swagger options
export const options = {
  swaggerDefinition: {
    basePath: '/api/',
    openapi: '3.0.0',
    info: {
      title: 'Haze API',
      version: '1.0.0',
      description: `
      현재 이 API는 사용자가 이미지를 관리하는 데에 사용됩니다.
      
      [Upcoming features]
      - 유저매칭 및 태그 기반 알고리즘
      - 소켓 설정
      - webRTC
      `,
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'local'
      },
      {
        url: 'http://13.125.38.177:3001',
        description: 'dev'
      },
      {
        url: 'http://TBD:3002',
        description: 'production'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  basedir: __dirname, // App's root folder
  apis: ['./src/**/*.ts'],
};


export const swaggerSpec = swaggerJSDoc(options);
export { serve, setup };