import { Request, Response } from 'express';
import { appVersion } from '../constants';

//version (yyyy-m-d)
//forceUpdate (bool)

class VersionController {
  /**
   * @swagger
   * /api/version:
   *   get:
   *     summary: 앱 버전 조회
   *     description: '앱 버전을 조회합니다.'
   *     tags: [ Version ]
   *     responses:
   *       200:
   *         description: 버전을 성공적으로 가져온 경우.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  version:
   *                    type: string
   *                    description: 버전 날짜.
   *                    example: 2023-1-15
   *                  forceUpdate:
   *                    type: boolean
   *                    description: 강제업데이트 여부.
   *                    example: true
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
  public async getAppVersion(req: Request, res: Response) {
    try {
      return res.status(200).json({ version: appVersion, forceUpdate: true });
    } catch (error) {
      return res.status(500).json({ message: '서버 내부 에러', error });
    }
  }
}

export default new VersionController();
