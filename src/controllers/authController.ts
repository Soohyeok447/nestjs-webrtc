import { Request, Response } from 'express';
import AuthService from './../services/authService'
import { FetchOrGenerateTokenDTO } from './dtos/authDTOs/fetchOrGenerateTokenDTO';
import { RenewTokenDTO } from './dtos/authDTOs/renewTokenDTO';
import { InvalidTokenException } from '../exceptions/auth/InvalidToken';
import { NotFoundTokenException } from '../exceptions/auth/NotFoundToken';

class AuthController {
  /**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: 접속 시 토큰 존재여부를 확인 후, 유효한 accessToken일 경우 그대로 반환. 토큰이 없으면 발급
 *     description: '클라이언트가 API를 사용하기 위해선 accessToken이 필요하기 때문에
 *        Haze를 실행하게 되면 `꼭` signin을 호출하는 과정이 필요합니다.<br><br>
 * 
 *        signin을 호출함으로써 토큰의 유효성을 검사하고. 없으면 토큰을 발급합니다. <br><br>
 * 
 *        accessToken은 Haze API를 호출하는데에 사용되며<br>
 *        refreshToken은 accessToken을 갱신하는데에 사용됩니다.<br><br>
 * 
 *        accessToken의 payload안에 서버에서 생성한 고유한 userId가 저장됩니다. (socketId는 추후 추가예정)<br>
 *        클라이언트는 단지 accessToken과 refreshToken을 저장해두고 api를 호출할 때 헤더에 추가해서 호출하면 됩니다. <br><br>
 * 
 *        `case 1)` <br>
 *        만약 헤더에 BearerToken이 없는 상태로 호출하게 되면 ( ex)최초접속 )<br>
 *        201과 함께 accessToken과 refreshToken을 response받습니다.<br><br>
 * 
 *        `case 2)` <br>
 *        만약 헤더에 유효한 accessToken을 넣고 호출하게 되면 ( ex)재접속 )<br>
 *        accessToken를 그대로 response받습니다.<br><br>
 * 
 *        `case 3)` <br>
 *        만약 헤더에 만료되었거나 유효하지 않은 accessToken을 넣고 호출하게 되면 401을 response받습니다.<br>
 *        이 경우에는 저장된 refreshToken이 있다면 renew를 시도하고<br>
 *        저장된 refreshToken이 없다면 토큰을 재발급 받아야합니다.<br>
 *        renew에 성공했을 경우에는 갱신받은 accessToken을 저장한 뒤, 계속 api를 호출하면 됩니다.<br>
 *        renew에 실패했을 경우에는 signin을 통해 accessToken과 refreshToken을 재발급 받아야합니다.<br><br>
 * 
 * 
 *        `accessToken expiration -> 30분`<br>
 *        `refreshToken expiration -> 30일`<br><br><br>
 * 
 *        `[Header]`<br>
 *        Authorization AccessToken (Optional)<br><br><br>
 *        `[Exceptions]`<br>
 *        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>'
 
 *     tags: [ Auth ]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: false
 *         description: 인증에 사용되는 헤더 토큰.
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
 *     responses:
 *       200:
 *         description: 유효한 토큰으로 api를 호출한 경우. <br>이 토큰을 계속 api 호출에 사용하면 됩니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
 *       201:
 *         description: 토큰이 성공적으로 생성된 경우. <br>accessToken과 refreshToken을 내부저장소에 저장한 후 api 호출에 사용하면 됩니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
 *       401:
 *         description: 토큰이 유효하지 않거나 만료된 경우.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 1000
 *                 message:
 *                   type: string
 *                   example: 토큰이 만료되었거나 유효하지 않습니다.
 * 
 *       500:
 *         description: 내부 서버 오류가 발생한 경우.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 내부 에러
 *                 error:
 *                   type: object
 *                   example: {}
 */
  public async signIn({ headers }: Request, res: Response) {
    const accessToken = headers['authorization']?.split(' ')[1];

    const fetchOrGenerateToken: FetchOrGenerateTokenDTO = {
      accessToken
    }

    try {
      const { accessToken, refreshToken } = await AuthService.signIn(fetchOrGenerateToken)

      return res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
      if (error instanceof InvalidTokenException) {
        return res.status(401).json(error);
      }

      return res.status(500).json({ message: '서버 내부 에러', error })
    }
  }

  /**
 * @swagger
 * /api/auth/renew:
 *   post:
 *     summary: refreshToken을 이용해서 accessToken을 갱신할지 accessToken과 refreshToken을 재발급받을지 결정합니다.
 *     description: '클라이언트가 Api를 사용하는 도중 401을 response받게 되면<br> 
 *          refreshToken을 이용해서 accessToken을 갱신해야합니다.<br><br>
 * 
 *          만약 refreshToken이 유효하면 accessToken을 갱신하고,<br>
 *          유효하지 않다면(401) signin을 통해 accessToken, refreshToken을 재발급받아야합니다.<br><br><br>
 *  
 *        `[Header]`<br>
 *        Authorization AccessToken (Required)<br><br><br>
 *        `[Exceptions]`<br>
 *        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
 *        code: 1001 (400) - 토큰이 제공되지 않은 경우<br>'
 *    
 *     tags: [ Auth ]
 * 
 *     responses:
 *       201:
 *         description: accessToken을 성공적으로 갱신했을 경우.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
*                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
 *       401:
 *         description: 토큰이 유효하지 않거나 만료된 경우.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 1000
 *                 message:
 *                   type: string
 *                   example: 토큰이 만료되었거나 유효하지 않습니다.
 *       400:
 *         description: 토큰이 Authorization 헤더에 제공되지 않은 경우.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 1001
 *                 message:
 *                   type: string
 *                   example: 토큰이 없습니다.
 *       500:
 *         description: 내부 서버 오류가 발생한 경우.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 내부 에러
 *                 error:
 *                   type: object
 *                   example: {}
 */
  public renewToken({ headers }: Request, res: Response) {
    const refreshToken = headers['authorization']?.split(' ')[1];

    const renewTokenDTO: RenewTokenDTO = {
      refreshToken
    }

    try {
      const { accessToken } = AuthService.renewAccessToken(renewTokenDTO)

      return res.status(201).json({ accessToken });
    } catch (error) {
      if (error instanceof NotFoundTokenException) {
        return res.status(400).json(error);
      }

      if (error instanceof InvalidTokenException) {
        return res.status(401).json(error);
      }

      return res.status(500).json({ message: '서버 내부 에러', error })
    }
  }
}

export default new AuthController();