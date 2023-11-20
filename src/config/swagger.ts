import swaggerJSDoc from 'swagger-jsdoc';
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
      
      [implemented features]
      - health
      - user onboarding
      - authentication with JWT
      - User CRU
      - Images CRU
      
      [Upcoming features]
      - 유저매칭 및 태그 기반 알고리즘
      - 소켓 설정
      - webRTC

      [패치 노트]
      -231120-
      /auth/signin endpoint 제거:
      refreshToken의 expiration이 30년으로 수정됨에 따라
      refreshToken을 갱신하는 로직을 제거함

      앞으로 클라이언트는 onboard -> renew 과정만 거치면 됨


      -------------
      /auth/renew response model 수정:
      기존의 renew가 accessToken, refreshToken을 반환하던 것을 갱신된 accessToken만 response하도록 수정


      -------------
      /auth/onboard request body 수정:
      socketId: String 필드가 추가됨

      아직은 소켓 서버 구현중.
      현재 onboard 테스트를 위해서는 socketId에 아무 string이나 넣으면 됨. (socketId 필드가 비어있으면 400 exception)

      추후 socket 서버가 구현이 되면 socket에 생성된 socketId를 파라미터에 넣고 onboard하면 됨.
      `,
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'local',
      },
      {
        url: 'https://dev.haze.monster:3001',
        description: 'dev',
      },
      {
        url: 'TBD',
        description: 'production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  basedir: __dirname, // App's root folder
  apis: ['./src/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
export { serve, setup };
