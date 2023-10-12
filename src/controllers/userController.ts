import { Request, Response } from 'express';
import { UserResponseModel } from '../models/userResponseModel';
import UserService from '../services/userService';

class UserController {
  /**
  * @swagger
  * /api/users/:
  *   put:
  *     summary: 유저 정보 수정
  *     description: '유저 정보를 수정합니다 <br><br>
  *        
  *        [Request] <br>
  *        nickname: String (Required) - 8자리 이하 영어, 숫자, 한글만 허용됩니다. <br>
  *        birth: String (Required) - YYYY-MM-DD 형식이어야 합니다. <br>
  *        location: Location (Required) <br>
  *        interests: Interests (Required) <br>
  *        purpose: Purpose (Required) <br><br>
  * 
  *       `[Header]`<br>
  *       Authorization AccessToken (Required)<br><br>
  * 
  * 
  *        `[Exceptions]`<br>
  *        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
  *        code: 1001 (401) - 토큰이 제공되지 않은 경우<br>
  *        code: 1002 (401) - 토큰이 만료된 경우<br>
  *        code: 1 (400) - InvalidNicknameException. nickname은 8자 이하 영어,숫자,한글만 허용됩니다.<br>
  *        code: 3 (400) - InvalidBirthFormatException. birth는 YYYY-MM-DD 형식이어야 합니다.<br>
  *        code: 4 (400) - InvalidLocationException. location은 정해진 지역 중에서 3개 이하만 허용됩니다.<br>
  *        code: 5 (400) - InvalidInterestsException. 관심사는 정해진 목록 중에서 3개 이하만 허용됩니다.<br>
  *        code: 6 (400) - InvalidPurposeException. 유효하지 않은 만남 purpose입니다.<br>
  *        code: 7 (404) - NotFoundUserException. 유저를 찾을 수 없음'
  *     tags: [ Users ]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: 인증에 사용되는 헤더 토큰.
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdateUserDTO'
  *     responses:
  *       201:
  *         description: 유저가 성공적으로 수정된 경우.
  *         content:
  *           application/json:
  *             schema:
  *                $ref: '#/components/schemas/UserResponseModel'
  *       400:
  *         description: request body가 유효하지 않은 경우.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/InvalidGenderException'
  *       401:
  *         description: 토큰이 만료된 경우.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/TokenExpiredException'
  *       404:
  *         description: 유저를 찾지 못한 경우.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/NotFoundUserException'
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
  public async update({ body, userId }: Request, res: Response) {
    try {
      const updateUserDTO = {
        id: userId,
        nickname: body.nickname,
        birth: body.birth,
        location: body.location,
        interests: body.interests,
        purpose: body.purpose,
      }

      const updatedUser: UserResponseModel = await UserService.update(updateUserDTO);

      return res.status(201).json(updatedUser)
    } catch (error) {


      return res.status(500).json({ message: '서버 내부 에러', error })
    }
  }


  /**
* @swagger
* /api/users/me:
*   get:
*     summary: 유저 본인정보 조회
*     description: '유저 본인을 조회합니다. <br><br>
*       `[Header]`<br>
*       Authorization AccessToken (Required)<br><br>
*        `[Exceptions]`<br>
*        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
*        code: 1001 (401) - 토큰이 제공되지 않은 경우<br>
*        code: 1002 (401) - 토큰이 만료된 경우<br>
*        code: 7 (404) - NotFoundUserException. 유저를 찾을 수 없음'
*     tags: [ Users ]
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
*         description: 유저가 성공적으로 수정된 경우.
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/UserResponseModel'
*       401:
*         description: 토큰이 만료된 경우.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/TokenExpiredException'
*       404:
*         description: 유저를 찾지 못한 경우.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/NotFoundUserException'
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
  public async findMe({ userId }: Request, res: Response) {
    try {
      const user: UserResponseModel = await UserService.findById(userId);

      return res.status(200).json(user)
    } catch (error) {

      return res.status(500).json({ message: '서버 내부 에러', error })
    }
  }


  /**
* @swagger
* /api/users/{id}:
*   get:
*     summary: 유저 정보 조회
*     description: 'path parameter로 특정 유저를 조회합니다. <br><br>
* 
*       `[Header]`<br>
*       Authorization AccessToken (Required)<br><br>
* 
*       `[Path Parameter]`<br>
*       id: String (Required)<br><br>

*        `[Exceptions]`<br>
*        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
*        code: 1001 (401) - 토큰이 제공되지 않은 경우<br>
*        code: 1002 (401) - 토큰이 만료된 경우<br>
*        code: 7 (404) - NotFoundUserException. 유저를 찾을 수 없음'

*     tags: [ Users ]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: 검색할 유저의 ID.
*         schema:
*           type: string
*       - in: header
*         name: Authorization
*         required: true
*         description: 인증에 사용되는 헤더 토큰.
*         schema:
*           type: string
*           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
*     responses:
*       201:
*         description: 유저가 성공적으로 수정된 경우.
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/UserResponseModel'
*       401:
*         description: 토큰이 만료된 경우.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/TokenExpiredException'
*       404:
*         description: 유저를 찾지 못한 경우.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/NotFoundUserException'
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
  public async findById({ params }: Request, res: Response) {
    const { id } = params;

    try {
      const user: UserResponseModel = await UserService.findById(id);

      return res.status(200).json(user)
    } catch (error) {

      return res.status(500).json({ message: '서버 내부 에러', error })
    }

  }
}

export default new UserController();