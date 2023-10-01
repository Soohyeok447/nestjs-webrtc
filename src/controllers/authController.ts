import { Request, Response } from 'express';
import { generateTokens, renewToken, verifyToken } from '../services/authService';
import { Token } from '../types/token';
import { InvalidTokenException } from '../exceptions/auth/InvalidToken';
import { NotFoundTokenException } from '../exceptions/auth/NotFoundToken';


class AuthController {
  /**
   * 접속 시 토큰 존재여부를 확인 후, 유효한 토큰일경우 그대로 반환합니다.
   */
  public fetchOrGenerateToken({ headers }: Request, res: Response) {
    const accessToken = headers['authorization']?.split(' ')[1];

    try {
      //accessToken이 없으면 token을 generate후 response
      if (!accessToken) {
        const { accessToken, refreshToken }: Token = generateTokens();

        return res.status(201).json({ accessToken, refreshToken })
      }

      //accessToken이 만료됐으면 401반환. 클라이언트는 401을 수신할 경우 renew를 시도해야합니다.
      if (!verifyToken(accessToken)) {
        return res.status(401).json(InvalidTokenException)
      }

      return res.status(201).json({ accessToken });
    } catch (error) {
      return res.status(500).json({ message: '알 수 없는 에러', error })
    }
  }

  /**
   * refreshToken을 이용해서 accessToken을 갱신할지 토큰을 재발급받을지 결정합니다.
   */
  public renewToken({ headers }: Request, res: Response) {
    const refreshToken = headers['authorization']?.split(' ')[1];

    //refreshToken이 없으면 401반환.
    if (!refreshToken) {
      return res.status(401).json(NotFoundTokenException)
    }

    try {
      //refreshToken이 만료됐으면 401반환. 클라이언트는 401와 error code 2를 수신할 경우 토큰을 재발급받아야합니다.
      if (!verifyToken(refreshToken)) {
        return res.status(401).json(InvalidTokenException)
      }

      const { accessToken } = renewToken(refreshToken);

      return res.status(201).json({ accessToken });
    } catch (error) {
      return res.status(500).json({ message: '알 수 없는 에러', error })
    }
  }
}

export default new AuthController();