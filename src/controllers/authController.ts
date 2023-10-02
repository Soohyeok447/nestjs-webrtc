import { Request, Response } from 'express';
import AuthService from './../services/authService'
import { FetchOrGenerateTokenDTO } from './dtos/authDTOs/fetchOrGenerateTokenDTO';
import { RenewTokenDTO } from './dtos/authDTOs/renewTokenDTO';

class AuthController {
  /**
   * 접속 시 토큰 존재여부를 확인 후, 유효한 토큰일경우 그대로 반환합니다.
   */
  public fetchOrGenerateToken({ headers }: Request, res: Response) {
    const accessToken = headers['authorization']?.split(' ')[1];

    const fetchOrGenerateToken: FetchOrGenerateTokenDTO = {
      accessToken
    }

    try {
      const { accessToken, refreshToken } = AuthService.fetchOrGenerateToken(fetchOrGenerateToken)

      return res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
      if (error.code === 2) {
        return res.json(401).json({ ...error });
      }

      return res.status(500).json({ ...error })
    }
  }

  /**
   * refreshToken을 이용해서 accessToken을 갱신할지 토큰을 재발급받을지 결정합니다.
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
      if (error.code === 1) {
        return res.json(404).json({ ...error });
      }

      if (error.code === 2) {
        return res.json(401).json({ ...error });
      }

      return res.status(500).json({ message: '알 수 없는 에러', ...error })
    }
  }
}

export default new AuthController();