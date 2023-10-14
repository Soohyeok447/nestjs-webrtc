import { Request, Response } from 'express';
import AuthService from './../services/authService';
import { FetchOrGenerateTokenDTO } from './dtos/authDTOs/fetchOrGenerateTokenDTO';
import { RenewTokenDTO } from './dtos/authDTOs/renewTokenDTO';
import { InvalidTokenException } from '../exceptions/auth/InvalidToken';
import { OnBoardDTO } from './dtos/authDTOs/onBoardDTO';
import {
  InvalidBirthFormatException,
  InvalidGenderException,
  InvalidInterestsException,
  InvalidLocationException,
  InvalidNicknameException,
  InvalidPurposeException,
} from '../exceptions/users';
import uuid from 'uuid';

class AuthController {
  /**
   * @swagger
   * /api/auth/onboard:
   *   post:
   *     summary: 회원가입 + accessToken, refreshToken 신규 발급
   *     description: 'renew가 불가능한경우나 신규 유저일 경우 onboarding을 해야합니다. <br><br>
   *
   *        onboarding 과정을 통해 User Model을 새로 생성하고 api이용에 필요한 토큰도 발급하게 됩니다. <br><br>
   *
   *        [Request] <br>
   *        gender: Gender (Required) 수정불가 <br>
   *        nickname: String (Required) - 8자리 이하 영어, 숫자, 한글만 허용됩니다. <br>
   *        birth: String (Required) - YYYY-MM-DD 형식이어야 합니다. <br>
   *        location: Location (Required) <br>
   *        interests: Interests (Required) <br>
   *        purpose: Purpose (Required) <br><br>
   *
   *        `[Exceptions]`<br>
   *        code: 1 (400) - InvalidNicknameException. nickname은 8자 이하 영어,숫자,한글만 허용됩니다.<br>
   *        code: 2 (400) - InvalidGenderException. gender는 MALE 또는 FEMALE이어야 합니다.<br>
   *        code: 3 (400) - InvalidBirthFormatException. birth는 YYYY-MM-DD 형식이어야 합니다.<br>
   *        code: 4 (400) - InvalidLocationException. location은 정해진 지역 중에서 3개 이하만 허용됩니다.<br>
   *        code: 5 (400) - InvalidInterestsException. 관심사는 정해진 목록 중에서 3개 이하만 허용됩니다.<br>
   *        code: 6 (400) - InvalidPurposeException. 유효하지 않은 만남 purpose입니다.<br>'
   *     tags: [ Auth ]
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OnBoardDTO'
   *     responses:
   *       201:
   *         description: 토큰이 성공적으로 생성된 경우. <br>accessToken과 refreshToken을 내부저장소에 저장한 후 api 호출에 사용하면 됩니다.
   *         content:
   *           application/json:
   *             schema:
   *                $ref: '#/components/schemas/Token'
   *       400:
   *         description: request body가 유효하지 않은 경우.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/InvalidBirthFormatException'
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
  public async onBoard({ body }: Request, res: Response) {
    const onBoardDTO: OnBoardDTO = {
      gender: body.gender,
      nickname: body.nickname,
      location: body.location,
      birth: body.birth,
      purpose: body.purpose,
      interests: body.interests,
    };

    try {
      const { accessToken, refreshToken } =
        await AuthService.onBoard(onBoardDTO);

      return res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
      if (
        error instanceof InvalidNicknameException ||
        error instanceof InvalidGenderException ||
        error instanceof InvalidBirthFormatException ||
        error instanceof InvalidLocationException ||
        error instanceof InvalidInterestsException ||
        error instanceof InvalidPurposeException
      ) {
        return res.status(400).json(error);
      }

      return res.status(500).json({ message: '서버 내부 에러', error });
    }
  }

  /**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: 접속 시 토큰 존재여부를 확인 후, 유효한 accessToken일 경우 accessToken과 refreshToken을 갱신
 *     description: '클라이언트가 API를 사용하기 위해선 accessToken이 필요하기 때문에
 *        Haze를 실행하게 되면 `꼭` signin을 호출하는 과정이 필요합니다.<br><br>
 * 
 *        signin을 호출함으로써 토큰의 유효성을 검사하고. api를 사용하기 위한 토큰을 갱신합니다. <br><br>
 * 
 *        accessToken은 Haze API를 호출하는데에 사용되며<br>
 *        refreshToken은 토큰을 갱신하는데에 사용됩니다.<br><br>
 * 
 *        `case 1)` <br>
 *        만약 헤더에 BearerToken이 없는 상태로 호출하게 되면 <br>
 *        401과 함께 MissingTokenException을 response받습니다. <br>
 *        이 경우에는 accessToken을 넣고 재요청을 하거나<br>
 *        onboard를 통해 onBoarding을 시도해야합니다. <br><br>
 * 
 *        `case 2)` <br>
 *        만약 헤더에 유효한 accessToken을 넣고 호출하게 되면 <br>
 *        새로 갱신받은 accessToken과 refreshToken을 response받습니다.<br><br>
 * 
 *        `case 3)` <br>
 *        만약 헤더에 유효하지 않은 accessToken을 넣고 호출하게 되면 <br>
 *        401과 함께 InvalidTokenException을 response받습니다.<br>
 *        이 경우에는 유효한 accessToken을 통해 재요청을 하거나 <br>
 *        onboard를 통해 onBoarding을 시도해야합니다.<br><br>
 * 
 *        `case 4)` <br>
 *        만약 헤더에 만료된 accessToken을 넣고 호출하게 되면 <br>
 *        401과 함께 TokenExpiredException을 response받습니다.<br>
 *        이 경우에는 renew를 통해 토큰을 갱신받아야합니다. <br>
 *        저장된 refreshToken이 없는 경우에는 onboard를 통해 onBoarding을 시도해야합니다. <br><br>
 *        
 * 
 *        `accessToken expiration -> 30분`<br>
 *        `refreshToken expiration -> 30일`<br><br><br>
 * 
 *        `[Header]`<br>
 *        Authorization AccessToken (Required)<br><br><br>
 *        `[Exceptions]`<br>
 *        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
 *        code: 1001 (401) - 토큰이 제공되지 않은 경우<br>
 *        code: 1002 (401) - 토큰이 만료된 경우'
 * 
 *     tags: [ Auth ]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: 인증에 사용되는 헤더 토큰.
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
 *     responses:
 *       201:
 *         description: 토큰이 성공적으로 갱신 된 경우. <br>
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Token'

 *       401:
 *         description: 토큰이 유효하지 않거나 만료된 경우.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidTokenException'
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
  public async signIn({ userId }: Request, res: Response) {
    const fetchOrGenerateToken: FetchOrGenerateTokenDTO = {
      userId,
    };

    try {
      const { accessToken, refreshToken } =
        await AuthService.signIn(fetchOrGenerateToken);

      return res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
      return res.status(500).json({ message: '서버 내부 에러', error });
    }
  }

  /**
   * @swagger
   * /api/auth/renew:
   *   post:
   *     summary: 세션유지를 위해 refreshToken을 이용해서 토큰을 갱신 받습니다.
   *     description: '클라이언트가 Api를 사용하는 도중 TokenExpiredException을 response받게 되면<br>
   *          저장된 refreshToken을 이용해서 accessToken과 refreshToken을 갱신해야합니다.<br><br>
   *
   *          재발급된 refreshToken은 다시 저장해야합니다. <br><br>
   *
   *          renew에 성공했을 경우에는 갱신받은 accessToken와 refreshToken을 저장한 뒤, 계속 api를 호출하면 됩니다.<br>
   *          renew에 실패했을 경우에는 더 이상 유저 정보를 찾을 수는 없으며, <br>
   *          onboard를 통해 새로운 accessToken과 refreshToken을 발급 받아야합니다.<br><br>
   *
   *          만약 refreshToken이 유효하면 토큰을 갱신하고,<br>
   *          토큰이 없거나 유효하지 않거나 만료된 경우(401) onboard를 통해 onboarding이 필요합니다.<br><br><br>
   *
   *        `[Header]`<br>
   *        Authorization AccessToken (Required)<br><br><br>
   *        `[Exceptions]`<br>
   *        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
   *        code: 1001 (401) - 토큰이 제공되지 않은 경우<br>
   *        code: 1002 (401) - 토큰이 만료된 경우'
   *
   *     tags: [ Auth ]
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         description: 인증에 사용되는 헤더 토큰.
   *         schema:
   *           type: string
   *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
   *     responses:
   *       201:
   *         description: 토큰을 성공적으로 갱신했을 경우.
   *         content:
   *           application/json:
   *             schema:
   *                $ref: '#/components/schemas/Token'
   *       401:
   *         description: 토큰이 유효하지 않거나 만료된 경우.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/InvalidTokenException'
   *       400:
   *         description: 토큰이 Authorization 헤더에 제공되지 않은 경우.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MissingTokenException'
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
  public async renew({ headers, userId }: Request, res: Response) {
    const refreshToken = headers['authorization']?.split(' ')[1];

    const renewTokenDTO: RenewTokenDTO = {
      refreshToken,
      userId,
    };

    try {
      const { accessToken, refreshToken } =
        await AuthService.renew(renewTokenDTO);

      return res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
      if (error instanceof InvalidTokenException) {
        return res.status(401).json(error);
      }

      return res.status(500).json({ message: '서버 내부 에러', error });
    }
  }
}

export default new AuthController();
