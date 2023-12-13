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
      - 유저매칭 및 webrtc signaling
      
      [Upcoming features]
      - 매칭 로깅
      - 화상채팅 도중 발생 이벤트(5분유지, 얼굴공개 수락, 신고)
      - 화상채팅 이후 발생 이벤트(쪽지)

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


      -231123-
      /auth/onboard request body에 socketId삭제:
      socketId: String 필드가 삭제됨


      -231212-
      매칭, webrtc 서버 개발 완료
      
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
