import { Request, Response } from 'express';
import { BlockLog } from '../models/blockLogModel';
import blockLogService from '../services/blockLogService';
import { BlockUserDTO } from './dtos/blockLogDTOs/blockUserDTO';
import { UnblockUserDTO } from './dtos/blockLogDTOs/unblockUserDTO';
import { NotFoundBlockLogException } from '../exceptions/blockLog/NotFoundBlockLogException';
import { NotFoundUserException } from '../exceptions/users';

class BlockLogController {
  /**
   * @swagger
   * /api/blockLog/block:
   *   put:
   *     summary: 유저를 차단함
   *     description: '유저를 차단합니다. <br><br>
   *
   *        `[Header]`<br>
   *        Authorization AccessToken (Required)<br><br>
   *
   *        `[Request]` <br>
   *        targetId: String - 차단할 유저의 id <br><br>
   *
   *        `[Exceptions]`<br>
   *        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
   *        code: 1001 (401) - 토큰이 제공되지 않은 경우<br>
   *        code: 1002 (401) - 토큰이 만료된 경우<br>
   *        code: 7 (404) - 차단할 유저를 찾을 수 없을 경우'
   *     tags: [ BlockLog ]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BlockUserDTO'
   *     responses:
   *       200:
   *         description: 차단 정보 가져오기 성공
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BlockLog'
   *       401:
   *         description: 토큰이 만료된 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TokenExpiredException'
   *       404:
   *         description: 차단할 유저를 찾을 수 없을 경우
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
  public async blockUser({ userId, body }: Request, res: Response) {
    const blockUserDto: BlockUserDTO = {
      userId,
      targetId: body.targetId,
    };

    try {
      const blockLog: BlockLog = await blockLogService.blockUser(blockUserDto);

      return res.status(201).json(blockLog);
    } catch (error) {
      if (error instanceof NotFoundUserException) {
        return res.status(404).json(error);
      }

      return res.status(500).json({ message: '서버 내부 에러', error });
    }
  }

  /**
   * @swagger
   * /api/blockLog/unblock:
   *   put:
   *     summary: 유저를 차단해제함
   *     description: '유저를 차단해제합니다. <br><br>
   *
   *        `[Header]`<br>
   *        Authorization AccessToken (Required)<br><br>
   *
   *        `[Request]` <br>
   *        targetId: String - 차단해제할 유저의 id <br><br>
   *
   *        `[Exceptions]`<br>
   *        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
   *        code: 1001 (401) - 토큰이 제공되지 않은 경우<br>
   *        code: 1002 (401) - 토큰이 만료된 경우<br>
   *        code: 1 (404) - 차단정보를 찾을 수 없음
   *        code: 7 (404) - 차단할 유저를 찾을 수 없을 경우'
   *     tags: [ BlockLog ]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UnblockUserDTO'
   *     responses:
   *       200:
   *         description: 차단 정보 가져오기 성공
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BlockLog'
   *       401:
   *         description: 토큰이 만료된 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TokenExpiredException'
   *       404:
   *         description: 차단할 유저를 찾을 수 없거나 차단 정보를 찾을 수 없는 경우
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
  public async unblockUser({ userId, body }: Request, res: Response) {
    const blockUserDto: UnblockUserDTO = {
      userId,
      targetId: body.targetId,
    };

    try {
      const blockLog: BlockLog =
        await blockLogService.unblockUser(blockUserDto);

      return res.status(201).json(blockLog);
    } catch (error) {
      if (
        error instanceof NotFoundBlockLogException ||
        error instanceof NotFoundUserException
      ) {
        return res.status(404).json(error);
      }

      return res.status(500).json({ message: '서버 내부 에러', error });
    }
  }

  /**
   * @swagger
   * /api/blockLog/me:
   *   get:
   *     summary: 유저의 차단정보를 가져옴
   *     description: '유저의 차단정보를 가져옵니다. <br><br>
   *
   *        `[Header]`<br>
   *        Authorization AccessToken (Required)<br><br>
   *
   *        `[Exceptions]`<br>
   *        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
   *        code: 1001 (401) - 토큰이 제공되지 않은 경우<br>
   *        code: 1002 (401) - 토큰이 만료된 경우<br>'
   *     tags: [ BlockLog ]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 차단 정보 가져오기 성공
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BlockLog'
   *       401:
   *         description: 토큰이 만료된 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TokenExpiredException'
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
  public async findBlockLog({ userId }: Request, res: Response) {
    try {
      const blockLog: BlockLog = await blockLogService.findBlockLog({ userId });

      return res.status(200).json(blockLog);
    } catch (error) {
      return res.status(500).json({ message: '서버 내부 에러', error });
    }
  }
}

export default new BlockLogController();
