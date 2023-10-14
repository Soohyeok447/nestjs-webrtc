import { Request, Response } from 'express';

class HealthController {
  /**
   * @swagger
   * /api/health:
   *   get:
   *     summary: health check
   *     description: '200이 response되면 서버가 정상 동작 중 <br>
   *        그 외는 문제가 있는 상태'
   *     tags: [ Health ]
   *     responses:
   *       200:
   *         description: health check에 성공한 경우.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: 서버 정상 작동 중
   */
  public healthCheck(_: Request, res: Response) {
    return res.status(200).json({ message: '서버 정상 작동 중' });
  }
}

export default new HealthController();
