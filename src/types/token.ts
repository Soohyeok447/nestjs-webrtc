/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: 액세스 토큰.
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
 *         refreshToken:
 *           type: string
 *           description: 리프레시 토큰 (Optional).
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ

 */

export interface Token {
  readonly accessToken: string;
  readonly refreshToken?: string;
}