import jwt from 'jsonwebtoken';
import UUIDService from './../services/uuidService'
import { Token } from '../types/token';
import { InvalidTokenException } from '../exceptions/auth/InvalidToken';
import { NotFoundTokenException } from '../exceptions/auth/NotFoundToken';
import { FetchOrGenerateTokenDTO } from '../controllers/dtos/authDTOs/fetchOrGenerateTokenDTO';
import { RenewTokenDTO } from '../controllers/dtos/authDTOs/renewTokenDTO';

class AuthService {
  public fetchOrGenerateToken({ accessToken }: FetchOrGenerateTokenDTO): Token {
    try {
      //accessToken이 없으면 token을 generate후 response
      if (!accessToken) {
        const { accessToken, refreshToken }: Token = this.generateTokens();

        return { accessToken, refreshToken };
      }

      //accessToken이 만료됐으면 401반환. 클라이언트는 401을 수신할 경우 renew를 시도해야합니다.
      if (!this.verifyToken(accessToken)) {
        throw InvalidTokenException;
      }

      return { accessToken };
    } catch (error) {
      throw { message: '알 수 없는 에러', error }
    }
  }

  public renewAccessToken({ refreshToken }: RenewTokenDTO): { accessToken: string } {
    //refreshToken이 없으면 401반환.
    if (!refreshToken) {
      throw NotFoundTokenException;
    }

    try {
      //refreshToken이 만료됐으면 401반환. 클라이언트는 401와 error code 2를 수신할 경우 토큰을 재발급받아야합니다.
      if (!this.verifyToken(refreshToken)) {
        throw InvalidTokenException;
      }

      const { accessToken } = this.renewToken(refreshToken);

      return { accessToken };
    } catch (error) {
      throw { message: '알 수 없는 에러', error };
    }
  }

  public generateTokens(): Token {
    const userId: string = UUIDService.generateUUID();
    const ISS = process.env.HAZE_API_ISSUER;
    const API_KEY = process.env.HAZE_API_KEY;

    try {
      const accessToken = jwt.sign({ userId, iss: ISS }, API_KEY, { expiresIn: '30m' });
      const refreshToken = jwt.sign({ userId, iss: ISS }, API_KEY, { expiresIn: '30d' });

      return { accessToken, refreshToken };
    } catch (error) {
      throw error.toString();
    }
  }

  public renewToken(refreshToken: string): { accessToken: string } {
    const API_KEY = process.env.HAZE_API_KEY;

    try {
      const { userId, iss } = jwt.verify(refreshToken, API_KEY) as any;

      const accessToken = jwt.sign({ userId, iss }, API_KEY, { expiresIn: '30m' });

      return { accessToken };
    } catch (error) {
      throw error.toString();;
    }
  };

  public verifyToken(accessToken: string): boolean {
    const API_KEY = process.env.HAZE_API_KEY;

    try {
      jwt.verify(accessToken, API_KEY) as any;

      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();
